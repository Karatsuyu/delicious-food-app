from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import os
import mercadopago
import requests

# Access token: prefer environment variable if present
ACCESS_TOKEN = os.getenv('MERCADOPAGO_ACCESS_TOKEN', 'TEST-REPLACE_WITH_YOUR_ACCESS_TOKEN')

sdk = mercadopago.SDK(ACCESS_TOKEN)

@csrf_exempt
@require_POST
def create_preference(request):
    try:
        data = json.loads(request.body.decode('utf-8') or '{}')
    except Exception:
        data = {}

    items = data.get('items') or []
    # Fallback simple item if empty
    if not items:
        title = data.get('title', 'Producto de prueba')
        price = float(data.get('price', 10000))
        items = [{
            "title": title,
            "quantity": 1,
            "unit_price": price,
            "currency_id": "COP",
        }]
    else:
        # Normalize received items
        norm = []
        for it in items:
            try:
                norm.append({
                    "title": str(it.get('title') or it.get('nombre') or 'Producto'),
                    "quantity": int(it.get('quantity') or it.get('cantidad') or 1),
                    "unit_price": float(it.get('unit_price') or it.get('precio') or it.get('precioUnitario') or 0.0),
                    "currency_id": "COP",
                })
            except Exception:
                continue
        if norm:
            items = norm

    payer = data.get('payer') or {}
    payer_payload = {}
    if payer:
        payer_payload = {
            "name": payer.get('name') or payer.get('nombre') or '',
            "surname": payer.get('surname') or payer.get('apellidos') or '',
            "email": payer.get('email') or '',
            "phone": {
                "area_code": "57",
                "number": str(payer.get('phone') or payer.get('telefono') or ''),
            },
            "address": {
                "street_name": payer.get('address') or payer.get('direccion') or '',
                "zip_code": str(payer.get('zip') or payer.get('codigoPostal') or ''),
            },
        }

    preference_data = {
        "items": items,
        "payer": payer_payload,
        "back_urls": {
            "success": data.get('success_url') or "http://localhost:5173/success",
            "failure": data.get('failure_url') or "http://localhost:5173/failure",
            "pending": data.get('pending_url') or "http://localhost:5173/pending",
        },
        # "auto_return": "approved",  # opcional; puede causar error si back_urls no es aceptada por la cuenta
        # You can set notification_url to receive Webhooks later
    }

    try:
        preference = sdk.preference().create(preference_data)
        status_code = preference.get("status")
        resp = preference.get("response", {}) or {}
        if status_code != 201:
            return JsonResponse({
                "error": "mercadopago_error",
                "status": status_code,
                "error_type": resp.get("error"),
                "message": resp.get("message"),
                "cause": resp.get("cause"),
            }, status=400)

        pref_id = resp.get("id")
        init_point = resp.get("init_point") or resp.get("sandbox_init_point")
        if not pref_id:
            return JsonResponse({"error": "No se pudo crear la preferencia", "mp": resp}, status=500)
        return JsonResponse({"id": pref_id, "init_point": init_point})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def account_status(request):
    """Devuelve un resumen del estado de la cuenta asociada al Access Token.

    Útil para diagnosticar: país/site, status, tipo de usuario y si el token está activo.
    """
    token = ACCESS_TOKEN
    if not token or token.startswith('TEST-REPLACE'):
        return JsonResponse({
            "ok": False,
            "error": "token_missing",
            "message": "MERCADOPAGO_ACCESS_TOKEN no configurado en backend/.env",
        }, status=400)
    try:
        resp = requests.get(
            'https://api.mercadopago.com/users/me',
            headers={'Authorization': f'Bearer {token}'},
            timeout=20
        )
        data = resp.json() if resp.headers.get('content-type','').startswith('application/json') else {}
        subset = {
            'http_status': resp.status_code,
            'id': data.get('id'),
            'nickname': data.get('nickname'),
            'email': data.get('email'),
            'site_id': data.get('site_id'),
            'status': data.get('status'),
            'user_type': data.get('user_type'),
        }
        # Hint: si status != 'active' o site_id != 'MCO' (Colombia), habrá rechazos
        return JsonResponse({"ok": True, "account": subset})
    except Exception as e:
        return JsonResponse({"ok": False, "error": str(e)}, status=500)
