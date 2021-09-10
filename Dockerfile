FROM node:14.15.5-alpine3.10 AS build


WORKDIR /workspace
RUN yarn config set registry https://registry.npm.taobao.org

COPY . ./
RUN yarn
RUN yarn run build
RUN yarn --production

FROM node:14.15.5-alpine3.10

WORKDIR /workspace
ENV NODE_ENV=production

COPY --from=build /workspace/dist /workspace/dist
COPY --from=build /workspace/cloud /workspace/cloud
COPY --from=build /workspace/node_modules /workspace/node_modules

EXPOSE 3000
ENTRYPOINT [ "node" ]
CMD [ "dist/main.js" ]