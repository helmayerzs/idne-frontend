import * as React from 'react'
import { Route, Redirect, RouteComponentProps } from 'react-router-dom'
import type { RouteProps } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'

interface PrivateRouteParams extends RouteProps {
    component: | React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    roles: any[];
}


export function PrivateRoute({component: Component, roles, ...rest}: PrivateRouteParams) {

    const { keycloak } = useKeycloak()

    const myStorage = window.localStorage;


    const isAutherized = (roles: any[]) => {
        if (keycloak != null && keycloak.authenticated && keycloak && roles) {

            let obj: any = JSON.parse(JSON.stringify(keycloak.tokenParsed));

            if(keycloak.tokenParsed != null){
                myStorage.setItem("username", obj.preferred_username)
            }

            return roles.some(r => {
                const realm =  keycloak.hasRealmRole(r);
                const resource = keycloak.hasResourceRole(r);
                return realm || resource;
            });
        }
        return false;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                keycloak != null && keycloak.authenticated
                    ?
                    isAutherized(roles) ? <Component {...props} /> : <span>Access Denied</span>
                    : (
                        <ExternalRedirect
                            exact={true}
                            path={''}
                            link={keycloak.createLoginUrl()}
                        />
                    )
            }
        />
    )
}


interface Props {
    exact?: boolean;
    link: string;
    path: string;
    sensitive?: boolean;
    strict?: boolean;
}

const ExternalRedirect: React.FC<Props> = (props: Props) => {
    const { link, ...routeProps } = props;

    return (
        <Route
            {...routeProps}
            render={() => {
                window.location.replace(props.link);
                return null;
            }}
        />
    );
};
