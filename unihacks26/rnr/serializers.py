from rest_framework import serializers
from .models import UserMe, Institution, Queue, Token


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMe
        fields = ['id', 'name', 'email', 'reward_points']


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'email', 'phone', 'address']


class QueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Queue
        fields = '__all__'


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['id', 'user', 'queue', 'token_number', 'status', 'joined_at']
