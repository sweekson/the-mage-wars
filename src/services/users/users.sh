curl 'http://localhost:3030/users/' \
  -H 'Content-Type: application/json' \
  --data-binary '{ "email": "zack@amnesia.net", "name": "Zack", "password": "123456789" }'

curl 'http://localhost:3030/authentication/' \
  -H 'Content-Type: application/json' \
  --data-binary '{ "strategy": "local", "email": "wilson@amnesia.net", "password": "123456789" }'
