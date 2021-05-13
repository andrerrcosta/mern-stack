import ObjectMapper from "../../../nobble-common-demo/models/object-mapper";

export default function createFormGroup(...formItems) {

    let items = formItems;

    return {
        addFormItem(formItem) {
            items.push(formItem);
            return this;
        },
        isValid() {
            for (let i = 0; i < items.length; i++) {
                if (!items[i].isValid()) return false;
            }
            return true;
        },
        get(name) {
            return items.find(item => item.name === name);
        },
        set(name, value) {
            let formItem = items.find(item => item.name === name);
            if (formItem) formItem.value = value;
        },
        getInvalidFields() {
            let output = [];
            for (let i = 0; i < items.length; i++) {
                output.push({ formItem: items[i].name, validation: items[i].validate() });
            }
            return output.filter(item => item.validation.error);
        },
        toModel() {
            let output = ObjectMapper.builder();
            items.forEach(item => {
                output.add(item.name, item.value);
            });
            return output.object;
        },
        validate() {
            let output = []
            for (let i = 0; i < items.length; i++) {
                output.push({ formItem: items[i].name, validation: items[i].validate() });
            }
            return output;
        }
    }
}