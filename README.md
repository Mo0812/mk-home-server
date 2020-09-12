# mk-home-server

**mk-home-server** is build to offer the smarthome functionality of a device as a REST interface. In detail it is used to run on a server, like a raspberry pi, where several smarthome device are connected to. In particular for now the IKEA Tradfri gateway is supported, as well as a instance of [_netdata_](https://github.com/netdata/netdata) to monitor the system used underneath.

This project is still in an early development state and for now is somehow specified to the setup I using in my structure. Nevertheless you can easily utilize it to make it work with your setup or rebuild the environment I am using to make it work.

## Run the project

The **mk-home-server** REST API is designed to run by the [_pm2_](https://github.com/Unitech/pm2) process manager. The according settings for this can be found in the `ecosystem.config.yml`.

To start it with *pm2* you can use:

```
pm2 start ecosystem.config.yml
```

To save this setting over the next system startup and make it run permanently use:

```
pm2 save
```

If you just want to test the current implementation you can also run:

```
npm run dev
```

## UI to use the provided data

According to this server implementation there is also a UI which is using the offered functionality of this project to control specific devices with a Web App and make it accessible to all devices in the local network. It is called *mk-home* and can be found [here](https://github.com/Mo0812/mk-home).