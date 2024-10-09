import type {CommonProperties, RenderConfigScreenCtx} from 'datocms-plugin-sdk';
import {Button, Canvas, Form, SelectField} from 'datocms-react-ui';
import {useMemo, useState} from "react";

interface SelectOptions {
    label: string,
    value: string,
}

export type PluginConfig = {
    modelApiKeys: SelectOptions[]
}

const itemTypesToSelectOptions = (itemTypes: CommonProperties['itemTypes']): SelectOptions[] => Object.values(itemTypes)
    .flatMap(itemType => itemType ? [{
        label: itemType.attributes.name,
        value: itemType.attributes.api_key
    }] : [])
    .sort((a, b) => a.label.localeCompare(b.label))

export default function ConfigScreen({ctx}: { ctx: RenderConfigScreenCtx }) {
    const pluginParams = ctx.plugin.attributes.parameters as PluginConfig;
    const availableModels = itemTypesToSelectOptions(ctx.itemTypes);

    const [modelApiKeys, setModelApiKeys] = useState<SelectOptions[]>(pluginParams.modelApiKeys ?? []);

    const onSave = () => {
        ctx.updatePluginParameters({
            ...pluginParams,
            modelApiKeys: modelApiKeys
        }).then(() => {
            ctx.notice('Settings saved')
        })
    }

    const isDirty: boolean = useMemo(() => {

        // Compare the arrays by stringifying them
        return JSON.stringify(pluginParams.modelApiKeys) !== JSON.stringify(modelApiKeys);
    }, [modelApiKeys, pluginParams.modelApiKeys]);


    const lastCommit = typeof(process) !== 'undefined' && process.env?.VERCEL_GIT_COMMIT_SHA;


    return (
        <Canvas ctx={ctx}>
            <h2>This instance is running on {window.location.hostname}</h2>
            {lastCommit && <h3>Built from commit <a href={lastCommit} target='_blank'>{lastCommit.slice(-7)}</a></h3>}
            <Form>
                <SelectField
                    name="modelApiKeys"
                    id="modelApiKeys"
                    label="Model API Keys"
                    hint="Select one or more models"
                    value={modelApiKeys}
                    selectInputProps={{
                        isMulti: true,
                        options: availableModels ?? []
                    }}
                    onChange={(newValue) => setModelApiKeys(newValue as unknown as SelectOptions[])}
                />

                <Button onClick={onSave} disabled={!isDirty}>{isDirty ? 'Save' : 'Saved!'}</Button>

            </Form>
        </Canvas>
    );
}