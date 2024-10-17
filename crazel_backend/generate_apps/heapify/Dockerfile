FROM cirrusci/flutter:stable
        WORKDIR /app
        COPY . /app
        RUN flutter pub get
        RUN flutter build web
        EXPOSE 8080
        CMD ["python3", "-m", "http.server", "8080", "-d", "/app/build/web"]