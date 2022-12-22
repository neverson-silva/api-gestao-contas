FROM gradle:7.2.0-jdk17 AS TEMP_BUILD_IMAGE
WORKDIR /app
COPY . ./app
COPY --chown=gradle:gradle . /app

RUN gradle clean build

FROM eclipse-temurin:17_35-jdk-alpine
WORKDIR app
ENV ARTIFACT_NAME=api-gestao-contas-0.0.1.war
COPY --from=TEMP_BUILD_IMAGE /app/build/libs/$ARTIFACT_NAME /app/ROOT.war
EXPOSE 9090

CMD ["java","-jar","-Xms512m", "-Xmx1024m","/app/ROOT.war"]