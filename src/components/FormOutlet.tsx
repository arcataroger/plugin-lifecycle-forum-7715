import {Canvas} from 'datocms-react-ui';
import {RenderItemFormOutletCtx} from "datocms-plugin-sdk";
import {useEffect} from "react";


type PropTypes = {
    ctx: RenderItemFormOutletCtx;
};

export function FormOutlet({ctx}: PropTypes) {

    const {formValues, notice, } = ctx;
    const originalValue = formValues['field2']

    const doubleWarn = (msg: string): void => {
        const msgWithTimestamp = `${new Date().toISOString()}: ${msg}`
        notice(msgWithTimestamp)
        console.info(msgWithTimestamp)
    }

    useEffect(() => {
        const uuid = window.crypto.randomUUID()
        doubleWarn(`Setting field2 to ${uuid}`)
        ctx.setFieldValue('field2', uuid).then(() => {
            doubleWarn(`Reverting field2 to ${originalValue}`)
            ctx.setFieldValue('field2', originalValue)
        })
    }, [])

    return (
        <Canvas ctx={ctx}>
            Hello from the outlet!
            <h2>Debug</h2>

            <h3>formValues</h3>
            <pre>
                {JSON.stringify(formValues, null, 2)}
            </pre>
        </Canvas>
    );
}