var appConfig = {
    //baseApiUri: 'http://86.180.144.6:8080', // paul's server
    //baseApiUri: 'http://mpanupload242007.northeurope.cloudapp.azure.com:8080',
    baseApiUri: 'http://52.169.86.102:8080',

    signalRUri: 'http://portfoliogenerationnotificationservice.azurewebsites.net/NotificationServiceHub',
    //signalRUri: 'http://localhost:51891/NotificationServiceHub',

    hierarchyApiUri: 'http://portfoliogenerationfrontendbackend.azurewebsites.net',
    //hierarchyApiUri: 'http://localhost:60258',

    uploadApiUri: 'http://portfoliogenerationuploadapi.azurewebsites.net',
    //uploadApiUri: 'http://localhost:60564',

    auth0_callbackUrl: 'http://tpiflow-web.azurewebsites.net/login_complete',
    //auth0_callbackUrl: 'http://localhost:8585/login_complete',
    
    auth0_logoutCallbackUrl: 'http://tpiflow-web.azurewebsites.net/logout',
    //auth0_logoutCallbackUrl: 'http://localhost:8585/logout',

    auth0_clientId: 'BpcgVW1USg0wspNuWgJNrJIVqzQUZ2wa',
    auth0_domain: 'ringleader.eu.auth0.com'
}
