FROM node:10.15.3

RUN mkdir -p /app/front-end

WORKDIR /app/front-end

COPY package.json /app/front-end
COPY package-lock.json /app/front-end

RUN npm install

COPY . /app/front-end

EXPOSE 3000
CMD [ "npm", "start" ]