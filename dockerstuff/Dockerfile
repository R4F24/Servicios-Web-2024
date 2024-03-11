FROM python:3

WORKDIR /usr/src/app

COPY backend ./

COPY requirements.txt ./

#RUN --mount=type=cache,target=/root/.cache/pip RUN pip install -- upgrade pip
#RUN --mount=type=cache,target=/root/.cache/pip RUN pip install -r requirements.txt

ENV FLASK_APP=./backend/application.py
RUN pip install Cython && pip install cassandra-driver
RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

COPY . .

#CMD ["python", "./backend/application.py"]
CMD [ "python3", "-m" , "flask", "run"]

EXPOSE 80
EXPOSE 9042
