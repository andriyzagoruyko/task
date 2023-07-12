FROM node:18-alpine

RUN mkdir /app && chown -R node:node /app \
    && mkdir /data && chown -R node:node /data \
    && apk add nano docker \
    && apk add zsh zsh-vcs coreutils shadow \
    && apk add git \
    && adduser node docker \
    && apk add py-pip python3-dev libffi-dev openssl-dev gcc libc-dev make \
    && pip install docker-compose~=1.23.0 \
    && npm i -g @angular/cli@^15 \
    && npm i -g tsc-watch \
    && npm i -g @nestjs/cli@^10


# zsh auto complete
RUN git clone https://github.com/zsh-users/zsh-autosuggestions /home/node/.zsh/zsh-autosuggestions

COPY _fixtures/.zshrc /home/node/.zshrc

USER node
RUN /bin/zsh /home/node/.zshrc
USER root

# RUN npm install -g --quiet \
#     @vue/cli@3.3.0 \
#     @vue/cli-service@3.3.0 \
#     @vue/cli-plugin-babel

WORKDIR /app

# replace default shell for user "node": 
# node:x:1000:1000:Linux User,,,:/home/node:/bin/sh
# with 
# node:x:1000:1000:Linux User,,,:/home/node:/bin/zsh
RUN usermod --shell /bin/zsh node

ENTRYPOINT [ "/bin/zsh", "-c", "zsh" ]