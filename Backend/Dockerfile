FROM python:3.11
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /Backend

COPY requirements.txt /Backend/
RUN apt-get update && apt-get install -y build-essential python3-dev default-libmysqlclient-dev && pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]
#CMD ["gunicorn", "config.wsgi", "--bind", "62.72.21.70:8000"]

