var appConfig = {
    //baseApiUri: 'http://81.147.80.30:8080', // paul's server
    //baseApiUri: 'http://13.79.185.171:8080', // new azure
    //baseApiUri: 'http://mpanupload242007.northeurope.cloudapp.azure.com:8080',
    baseApiUri: 'http://52.169.86.102:8080',

    signalRUri: 'http://portfoliogenerationnotificationservice.azurewebsites.net/NotificationServiceHub',
    //signalRUri: 'http://localhost:51891/NotificationServiceHub',

    hierarchyApiUri: 'http://portfoliogenerationfrontendbackend.azurewebsites.net',
    //hierarchyApiUri: 'http://localhost:60258',

    uploadApiUri: 'http://portfoliogenerationuploadapi.azurewebsites.net',
    //uploadApiUri: 'http://localhost:60564',

    auth0_callbackUrl: 'http://demo.tpiflow.com/login_complete',
    //auth0_callbackUrl: 'http://localhost:8585/login_complete',
    
    auth0_logoutCallbackUrl: 'http://demo.tpiflow.com/logout',
    //auth0_logoutCallbackUrl: 'http://localhost:8585/logout',

    auth0_clientId: 'BpcgVW1USg0wspNuWgJNrJIVqzQUZ2wa',
    auth0_domain: 'ringleader.eu.auth0.com',

    environment_name: 'Demo',
    //environment_name: 'Local',
    version: '0.1.4'
}
