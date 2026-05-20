from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/tasks/', include('apps.tasks.urls')),
    path('api/v1/collaboration/', include('apps.collaboration.urls')),
    path('api/v1/progress/', include('apps.progress.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

