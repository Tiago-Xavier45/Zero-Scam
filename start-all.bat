@echo off
echo Iniciando microsserviços ZeroScam...

start cmd /k "cd eureka-server && mvnw spring-boot:run"
timeout /t 3
start cmd /k "cd denuncia && mvnw spring-boot:run"
timeout /t 3
start cmd /k "cd verificacao && mvnw spring-boot:run"
timeout /t 3
start cmd /k "cd usuario && mvnw spring-boot:run"
timeout /t 3
start cmd /k "cd api-gateway && mvnw spring-boot:run"
timeout /t 3
start cmd /k "cd frontend && npm start"

echo Todos os serviços foram iniciados!
pause