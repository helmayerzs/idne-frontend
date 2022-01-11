import React, { useEffect, useRef } from 'react';
import {I18nProvider} from "@lingui/react";
import {i18n} from "@lingui/core";
import {Trans} from "@lingui/macro";

  export const antdContext : any = (text : string) => {
        return <I18nProvider i18n={i18n}>
        <Trans id={text}></Trans>
            </I18nProvider>;
    };

