import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
import './routes/index.css'
import {AppRouter} from "./routes";
import {i18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
import hu from "./locales/hu/messages.json";
import en from "./locales/en/messages.json";

const eventLogger = (event: unknown, error: unknown) => {
    console.log('onKeycloakEvent', event, error)
}

const tokenLogger = (tokens: unknown) => {
    console.log('onKeycloakTokens', tokens)
}

i18n.load('hu', hu);
i18n.load('en', en);
i18n.activate(localStorage.getItem('language') ? localStorage.getItem('language')+'' : 'hu');

ReactDOM.render(
    <I18nProvider i18n={i18n}>
        <ReactKeycloakProvider
            authClient={keycloak}
            onEvent={eventLogger}
            onTokens={tokenLogger}
        >
            <AppRouter />
        </ReactKeycloakProvider>
    </I18nProvider>,
    document.getElementById('root')
)

// If you want to start measuring performance in youír app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
