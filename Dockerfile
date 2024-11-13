FROM nginx:alpine

# Копируем файлы проекта из директории src в директорию nginx
COPY src/ /usr/share/nginx/html/

# Настраиваем права доступа
RUN chmod 644 /usr/share/nginx/html/*

# Открываем порт 80
EXPOSE 80