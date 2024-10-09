import {Canvas} from 'datocms-react-ui';
import {RenderItemFormOutletCtx} from "datocms-plugin-sdk";
import {useEffect, useState} from "react";


type PropTypes = {
    ctx: RenderItemFormOutletCtx;
};

export function FormOutlet({ctx}: PropTypes) {

    const {formValues} = ctx;
    const originalValue = formValues['field2']

    const [currentCountdown, setCurrentCountdown] = useState(3);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (currentCountdown > 0) {
                setCurrentCountdown(prevState => prevState - 1)
            }

            if (currentCountdown === 1) {
                const uuid = window.crypto.randomUUID()
                console.info(`Setting field2 to ${uuid}`)
                ctx.setFieldValue('field2', uuid).then(() => {
                    console.info(`Reverting field2 to ${originalValue}`)
                    ctx.setFieldValue('field2', originalValue)
                })
                clearInterval(countdown)
            }
        }, 1000)

        return () => {
            clearInterval(countdown);
        }
    }, [currentCountdown])

    return (
        <Canvas ctx={ctx}>
            <h2>Hello from the outlet!</h2>

            {currentCountdown > 0 && <p>In <strong>{currentCountdown}</strong> seconds, this will set and then revert the value of field2...</p>}
            {currentCountdown === 0 && <p><strong>field2 has been set and reverted.</strong> You should've seen some form outlet redraws.</p>}

            <hr/>
        </Canvas>
    );
}