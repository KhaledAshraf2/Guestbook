FROM node:10.15.3

RUN mkdir -p /app/back-end

WORKDIR /app/back-end

COPY package.json /app/back-end
COPY package-lock.json /app/back-end

RUN npm install

COPY . /app/back-end

CMD ["npm", "run", "dev"]