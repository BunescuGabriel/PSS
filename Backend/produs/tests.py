from django.test import TestCase, RequestFactory
from django.core import mail
from django.http import JsonResponse
from produs import views
import json

class TestReservationEmailView(TestCase):
    def test_reservation_email(self):
        factory = RequestFactory()
        request = factory.post('/reservation-email', json.dumps({
            'prenume': 'John',
            'virsta': 30,
            'phone': '123456789',
            'fromDate': '2024-02-25',
            'toDate': '2024-03-02',
            'carInfo': {
                'id': 1,
                'name': 'Model',
                'producator': 'Producer'
            },
            'totalDays': 5,
            'priceForTotalDays': 50,
            'Pret_final': 250
        }), content_type='application/json')

        response = views.reservation_email(request)

        self.assertIsInstance(response, JsonResponse)
        data = json.loads(response.content)
        self.assertTrue(data['success'])

        self.assertEqual(len(mail.outbox), 1)

        sent_email = mail.outbox[0]
        self.assertIn('Rezervarea Masinilor: mesaj nou de la John', sent_email.subject)
        self.assertIn('Nume Produs: Producer Model', sent_email.body)




