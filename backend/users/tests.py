from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class UserRegistrationAndLoginTests(APITestCase):
	def setUp(self):
		self.register_url = reverse('register')  # /api/users/register/
		self.token_url = reverse('token_obtain_pair')  # /api/token/

	def test_user_registration_persists(self):
		data = {
			'username': 'persistuser',
			'email': 'persistuser@example.com',
			'password': 'Persist123!',
			'password_confirm': 'Persist123!',
			'first_name': 'Persist',
			'last_name': 'User'
		}
		resp = self.client.post(self.register_url, data, format='json')
		self.assertEqual(resp.status_code, status.HTTP_201_CREATED, resp.data)
		# User is saved in DB
		self.assertTrue(User.objects.filter(email='persistuser@example.com').exists())
		user = User.objects.get(email='persistuser@example.com')
		self.assertEqual(user.username, 'persistuser')
		self.assertTrue(user.is_active)

	def test_login_with_email_or_username(self):
		# Pre-create user
		user = User.objects.create_user(username='dualuser', email='dual@example.com', password='DualPass123!')
		# Login by email
		resp_email = self.client.post(self.token_url, {'email': 'dual@example.com', 'password': 'DualPass123!'}, format='json')
		self.assertEqual(resp_email.status_code, status.HTTP_200_OK, resp_email.content)
		self.assertIn('access', resp_email.data)
		# Login by username
		resp_username = self.client.post(self.token_url, {'username': 'dualuser', 'password': 'DualPass123!'}, format='json')
		self.assertEqual(resp_username.status_code, status.HTTP_200_OK, resp_username.content)
		self.assertIn('access', resp_username.data)

	def test_login_error_wrong_password(self):
		User.objects.create_user(username='wrongpw', email='wrongpw@example.com', password='Correct123!')
		resp = self.client.post(self.token_url, {'username': 'wrongpw', 'password': 'BadPass999!'}, format='json')
		self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertTrue('non_field_errors' in resp.data or 'detail' in resp.data)

	def test_login_error_inactive_user(self):
		inactive = User.objects.create_user(username='inactive', email='inactive@example.com', password='Inactive123!')
		inactive.is_active = False
		inactive.save()
		resp = self.client.post(self.token_url, {'email': 'inactive@example.com', 'password': 'Inactive123!'}, format='json')
		self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
		# Confirm inactivity message
		self.assertTrue(any('inactiva' in msg.lower() for msg in (resp.data.get('non_field_errors', []) if isinstance(resp.data.get('non_field_errors'), list) else [])))

