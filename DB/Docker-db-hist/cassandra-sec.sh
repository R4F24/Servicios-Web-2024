#!/bin/bash

grep -rl "authenticator: AllowAllAuthenticator" /etc/cassandra | xargs sed -i 's/authenticator: AllowAllAuthenticator/authenticator: PasswordAuthenticator/g'

grep -rl "authorizer: AllowAllAuthorizer" /etc/cassandra | xargs sed -i 's/authorizer: AllowAllAuthorizer/authorizer: org.apache.cassandra.auth.CassandraAuthorizer/g'


