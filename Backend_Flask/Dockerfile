FROM ubuntu:20.04

EXPOSE 5000
EXPOSE 80
#EXPOSE 9042

ENV FLASK_APP=./backend/app.py
#RUN apt-get gcc musl-dev linux-headers
RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
#ENTRYPOINT [ "python3" ]

COPY ./requirements.txt .

#WORKDIR /code

RUN pip3 install -r requirements.txt

#ENV PATH="/usr/local/bin:${PATH}"

COPY . .

CMD [ "python3", "-m" , "flask", "run", "-h", "0.0.0.0"]

#CMD ["ls"]
