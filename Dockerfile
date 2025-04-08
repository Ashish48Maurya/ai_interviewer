FROM node:23-alpine3.20
WORKDIR /user/src/app 
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm" ,"start" ]

# docker build -t client .
# docker run -p 3000:3000 --name frontend -d client