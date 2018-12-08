[![Build Status](https://stevenfollis.visualstudio.com/_apis/public/build/definitions/3ac656a6-63d4-488c-b8f9-f4e1c88cdb58/6/badge)](https://stevenfollis.visualstudio.com/Visualizeer/_build/index?definitionId=3ac656a6-63d4-488c-b8f9-f4e1c88cdb58)

# Visualizeer

Inspect and search through containers and nodes in a Docker EE cluster.

![demo](./images/visualizeer.gif)

Uses the Universal Control Plane (UCP) API

## Installation

### Docker Run

```
docker run \
  -d \
  -p 80:80 \
  -e 'ucp_fqdn=ucp.contoso.com' \
  -e 'ucp_username=admin' \
  -e 'ucp_password=SecurePassw0rd1' \
  --name visualizeer \
  stevenfollis/visualizeer:latest
```

### Docker Secrets
Visualizeer uses Docker Secrets to access an instance of Universal Control Plane

To setup secets, connect to the UCP cluster via a [Client Bundle](https://docs.docker.com/ee/ucp/user-access/cli) and create either with the GUI or:

```sh
printf 'ucp.moby.com' | docker secret create visualizeer.ucp_fqdn -

printf 'admin' | docker secret create visualizeer.ucp_username -

printf 'SecurePassw0rd1' | docker secret create visualizeer.ucp_password -
```

#### Docker Stack with Secrets:

```yaml
version: "3"
services:
  visualizeer:
    image: stevenfollis/visualizeer:latest
    ports:
      - "80:80"
    deploy:
      placement:
        constraints:
          - node.platform.os == linux
          - node.role == worker
    environment:
      - ucp_fqdn=ucp.contoso.com
      - ucp_username=admin
      - ucp_password=SecurePassw0rd1
```

### Environment Variables
Instead of Secrets, Visualizeer can use environment variable strings to access an instance of Universal Control Plane

| Variable Name | Purpose | Example Value |
|---|---|---|
| **ucp_fqdn** | FQDN for UCP load balancer | `ucp.contoso.com` |
| **ucp_username** | Username for account to use for querying the UCP API | `admin` |
| **ucp_password** | Password for account to use for querying the UCP API | `SecurePassw0rd1` |
| **refresh_rate** | How often to poll the API (ms). Defaults to 3000 (3s) | `3000` |
| **debug** | Enable debug mode for additional logging (default false) | `false` |

#### Docker Stack with Environment Variables:

```yaml
version: "3.3"
services:
  visualizeer:
    image: stevenfollis/visualizeer:latest
    ports:
      - "80:80"
    deploy:
      placement:
        constraints:
          - node.platform.os == linux
          - node.role == worker
    environment:
      - ucp_fqdn=ucp.contoso.com
      - ucp_username=admin
      - ucp_password=SecurePassw0rd1
```

## Features

* View node name, OS, and enabled schedulers (Swarm, Kubernets, Mixed)

* Hover on node OS to see architecture and engine version

* Colored node availability indicators for active, pause, and drain

* Colored container status indicators

* No browser refreshes needed - automatically polls the server and updates the UI

* Filter box to find particular nodes


## Inspiration

Inspired by [docker-swarm-visualizer](https://github.com/dockersamples/docker-swarm-visualizer)
