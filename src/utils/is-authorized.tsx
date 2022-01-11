export  const isAuthorized = (keycloak : Keycloak.KeycloakInstance, roles : any[]) : Boolean =>
{
    if (keycloak != null && keycloak.authenticated && keycloak && roles)
    {
        return roles.some(r => {
            const realm =  keycloak.hasRealmRole(r);
            const resource = keycloak.hasResourceRole(r);
            return realm || resource;
        });
    }
    return false;
}
export default isAuthorized;
