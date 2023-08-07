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


RUN git clone https://github.com/zsh-users/zsh-autosuggestions /home/node/.zsh/zsh-autosuggestions

COPY _fixtures/.zshrc /home/node/.zshrc

USER node
RUN /bin/zsh /home/node/.zshrc
USER root

WORKDIR /app

RUN usermod --shell /bin/zsh node

ENTRYPOINT [ "/bin/zsh", "-c", "zsh" ]