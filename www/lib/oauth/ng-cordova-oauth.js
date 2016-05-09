(function(){

    angular.module("ngCordovaOauth", ['ngCordovaOauthUtility']).factory('$cordovaOauth', ['$q', '$http', '$cordovaOauthUtility', function ($q, $http, $cordovaOauthUtility) {

        return {
            
            cc98: function(clientId, appScope, options) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("cordova-plugin-inappbrowser") === true || cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var redirect_uri = "http://localhost/callback";
                        if(options !== undefined) {
                            if(options.hasOwnProperty("redirect_uri")) {
                                redirect_uri = options.redirect_uri;
                            }
                        }
                        var browserRef = window.open('https://login.cc98.org/OAuth/Authorize?client_id=' + clientId + '&redirect_uri=http://localhost/callback&response_type=code&scope=' + appScope.join(" "), '_blank', 'location=no');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf(redirect_uri) === 0) {
                            	browserRef.removeEventListener("exit",function(event){});
                            	browserRef.close();
                                var callbackResponse = (event.url).split("?")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.code !== undefined && parameterMap.code !== null) {
                                    deferred.resolve({ code: parameterMap.code });
                                } else {
                                    deferred.reject("登录出错");
                                }
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("登录已取消");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            }
        };

    }]);


    /*
     * The purpose of ngCordovaOauthUtility is to act as a utility factory for assisting in
     * authentication to various services.  For example, Twitter requires request signing, so
     * a signature utility was added
     */
    angular.module("ngCordovaOauthUtility", []).factory('$cordovaOauthUtility', ['$q', function ($q) {

        return {

            /*
             * Sign an Oauth 1.0 request
             *
             * @param    string method
             * @param    string endPoint
             * @param    object headerParameters
             * @param    object bodyParameters
             * @param    string secretKey
             * @param    string tokenSecret (optional)
             * @return   object
             */
            createSignature: function(method, endPoint, headerParameters, bodyParameters, secretKey, tokenSecret) {
                if(typeof jsSHA !== "undefined") {
                    var headerAndBodyParameters = angular.copy(headerParameters);
                    var bodyParameterKeys = Object.keys(bodyParameters);
                    for(var i = 0; i < bodyParameterKeys.length; i++) {
                        headerAndBodyParameters[bodyParameterKeys[i]] = encodeURIComponent(bodyParameters[bodyParameterKeys[i]]);
                    }
                    var signatureBaseString = method + "&" + encodeURIComponent(endPoint) + "&";
                    var headerAndBodyParameterKeys = (Object.keys(headerAndBodyParameters)).sort();
                    for(i = 0; i < headerAndBodyParameterKeys.length; i++) {
                        if(i == headerAndBodyParameterKeys.length - 1) {
                            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]]);
                        } else {
                            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]] + "&");
                        }
                    }
                    var oauthSignatureObject = new jsSHA(signatureBaseString, "TEXT");

                    var encodedTokenSecret = '';
                    if (tokenSecret) {
                        encodedTokenSecret = encodeURIComponent(tokenSecret);
                    }

                    headerParameters.oauth_signature = encodeURIComponent(oauthSignatureObject.getHMAC(encodeURIComponent(secretKey) + "&" + encodedTokenSecret, "TEXT", "SHA-1", "B64"));
                    var headerParameterKeys = Object.keys(headerParameters);
                    var authorizationHeader = 'OAuth ';
                    for(i = 0; i < headerParameterKeys.length; i++) {
                        if(i == headerParameterKeys.length - 1) {
                            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '"';
                        } else {
                            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '",';
                        }
                    }
                    return { signature_base_string: signatureBaseString, authorization_header: authorizationHeader, signature: headerParameters.oauth_signature };
                } else {
                    return "Missing jsSHA JavaScript library";
                }
            },

            /*
            * Create Random String Nonce
            *
            * @param    integer length
            * @return   string
            */
            createNonce: function(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            },

            generateUrlParameters: function (parameters) {
                var sortedKeys = Object.keys(parameters);
                sortedKeys.sort();

                var params = "";
                var amp = "";

                for (var i = 0 ; i < sortedKeys.length; i++) {
                    params += amp + sortedKeys[i] + "=" + parameters[sortedKeys[i]];
                    amp = "&";
                }

                return params;
            },

            parseResponseParameters: function (response) {
                if (response.split) {
                    var parameters = response.split("&");
                    var parameterMap = {};
                    for(var i = 0; i < parameters.length; i++) {
                        parameterMap[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
                    }
                    return parameterMap;
                }
                else {
                    return {};
                }
            },

            generateOauthParametersInstance: function(consumerKey) {
                var nonceObj = new jsSHA(Math.round((new Date()).getTime() / 1000.0), "TEXT");
                var oauthObject = {
                    oauth_consumer_key: consumerKey,
                    oauth_nonce: nonceObj.getHash("SHA-1", "HEX"),
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                    oauth_version: "1.0"
                };
                return oauthObject;
            }
        };

    }]);

})();
