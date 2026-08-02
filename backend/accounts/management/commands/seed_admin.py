from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from accounts.models import AdminProfile

User = get_user_model()

ADMIN_EMAIL = "bposadmin@gmail.com"
ADMIN_PASSWORD = "password123"


class Command(BaseCommand):
    help = "Seed a dummy admin user (bposadmin@gmail.com / password123)"

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(
            email=ADMIN_EMAIL,
            defaults={"role": User.Role.ADMIN},
        )

        if created:
            user.set_password(ADMIN_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Admin created: {ADMIN_EMAIL}"))
        else:
            self.stdout.write(
                self.style.WARNING(f"Admin already exists: {ADMIN_EMAIL}")
            )

        AdminProfile.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS("AdminProfile ensured"))
