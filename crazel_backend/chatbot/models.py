from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    query = models.TextField()  # Store the user's initial query
    response = models.TextField()  # Store the chatbot's response
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id} - {self.user.username if self.user else 'Guest'}"

    class Meta:
        app_label = 'chatbot'