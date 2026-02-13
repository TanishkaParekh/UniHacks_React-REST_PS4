from django.db import models

from django.utils import timezone






class UserMe(models.Model):


    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200) 
    reward_points = models.IntegerField(default=0)


    
    swaps_used = models.IntegerField(default=0)


    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name






class Institution(models.Model):


    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=200)  


    address = models.TextField(null=True, blank=True)


    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name





class Queue(models.Model):


    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="queues"
    )


    name = models.CharField(max_length=255)
    size = models.IntegerField()


    service_time_minutes = models.IntegerField(default=5)


    is_paused = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)


    allow_swaps = models.BooleanField(default=True)
    max_swaps_per_user = models.IntegerField(default=2)


    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name






class Token(models.Model):


    STATUS_CHOICES = (
        ('WAITING', 'Waiting'),
        ('COMPLETED', 'Completed'),
        ('SKIPPED', 'Skipped'),
    )


    user = models.ForeignKey(
        UserMe,
        on_delete=models.CASCADE,
        related_name="tokens"
    )


    queue = models.ForeignKey(
        Queue,
        on_delete=models.CASCADE,
        related_name="tokens"
    )


    token_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')


    joined_at = models.DateTimeField(auto_now_add=True)
    called_at = models.DateTimeField(null=True, blank=True)


    def is_call_expired(self):
        if not self.called_at:
            return False
        expiry_time = self.called_at + timezone.timedelta(seconds=60)
        return timezone.now() > expiry_time


    def __str__(self):
        return f"Token {self.token_number} - {self.queue.name}"


    class Meta:
        ordering = ['token_number']



