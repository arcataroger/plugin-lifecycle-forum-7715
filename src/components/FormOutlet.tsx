import { Canvas } from 'datocms-react-ui';
import {RenderItemFormOutletCtx} from "datocms-plugin-sdk";
type PropTypes = {
    ctx: RenderItemFormOutletCtx;
};

export function FormOutlet({ ctx }: PropTypes) {
    return (
        <Canvas ctx={ctx}>
            Hello from the outlet!
        </Canvas>
    );
}