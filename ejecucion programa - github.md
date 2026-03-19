backend

cd backend

npm run dev

frontend

cd frontend

npm run dev

subir al repositorio
AGREGA NUEVOS Y MODIFICACIONES PERO PUEDE FALLAR CON ELIMINADOS EN ALGUNOS CASOS
pasos:

git add .
git commit -m "modulo pedidos"
git push origin main

SOLO MODIFICADOS NO NUEVOS

git add -u
git commit -m "modulo pedidos"
git push origin main

TODO (RECOMENDADO)

git add -A
git commit -m "modulo pedidos"
git push origin main


bajar del repositorio
pasos:

CUANDO DESEAD CLONAR EL REPOSITORIO POR PRIMERA VEZ

1. git clone https://github.com/yourusername/your-repo.git
2. cd your-repo
3. git checkout main

SOLO ACTUALIZACIONES
4. git pull origin main
