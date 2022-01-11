import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

export type InitialState<S> = S | (() => S);
export type UseSafeStateResult<S> = [S, Dispatch<SetStateAction<S>>];

function useSafeState<S>(initialState: InitialState<S>): UseSafeStateResult<S>;
function useSafeState<S = undefined>(): UseSafeStateResult<S | undefined>;

function useSafeState<S>(initialState?: InitialState<S>) {
    const mounted = React.useRef(true);

    React.useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    });

    return initialState === undefined
        ? CreateStateWithoutInitialState<S>(mounted)
        : CreateStateWithInitialState<S>(initialState, mounted);
}

export default useSafeState;

// UTILS

function CreateStateWithInitialState<S>(
    initialState: InitialState<S>,
    mounted: React.MutableRefObject<boolean>,
): UseSafeStateResult<S> {
    const [state, _setState] = React.useState<S>(initialState);

    const setState = React.useCallback(createSetStateCallback(_setState, mounted), [mounted.current]);

    return [state, setState];
}

function CreateStateWithoutInitialState<S>(
    mounted: React.MutableRefObject<boolean>,
): UseSafeStateResult<S | undefined> {
    const [state, _setState] = React.useState<S>();

    const setState = React.useCallback(createSetStateCallback(_setState, mounted), [mounted.current]);

    return [state, setState];
}

function createSetStateCallback<S>(
    setState: Dispatch<SetStateAction<S>>,
    mounted: React.MutableRefObject<boolean>,
): Dispatch<SetStateAction<S>> {
    return value => {
        if (mounted.current) {
            setState(value);
        }
    };
}
