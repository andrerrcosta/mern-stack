import NobbleTerminal from "../utils/terminal.utils";

export const pluggable = (value) => {
    /**
     * Em breve eu vou criar uma classe capaz de criar models
     * para serem usados em componentes onde você pode usar two-way databinding
     * aliado a observables e states para entregar os dados em uma abstração à parte.
     * 
     * O conceito correto para se usar dentro de componentes (uma vez que os criadores
     * do react quizeram sofismar o two-way data-binding para estabelecer um padrão 
     * COMPLETAMENTE DUVIDOSO para troca de dados e estados entre uma aplicação, uma vez
     * que o problema que eles estavam julgando resolver foram eles mesmos quem criaram)
     * seria o mesmo modelo de entidades persistíveis. O problema que o react julga resolver
     * é trivial e é como procurar pelo em ovo. Não existe nada de errado com o two-way data-binding.
     * 
     * O conceito de troca de estados entre mais de dois componentes é através de observables e
     * ponto final. O conceito de ciclo de vida de um componente, seja ele em um ambiente multithreading
     * ou concorrente é complexo e exige mais do que padrões de projetos. Quando você começa a
     * criar milhares de conceitos diferentes é o momento em que
     * você está atirando para todos os lados tentando tornar atômica uma lógica que não é.
     * 
     * No final das contas você se torna alienado do que é de fato atômico na programação
     * porque você passa tempo demais estudando padrões cujas diferenças entre si são
     * mínimas e que sequer são reais.
     * 
     */

    let object = {
        key: value
    };
    // Object.isSealed
    Object.defineProperty(object, "key", {
        set: (v) => {
            NobbleTerminal.info("Object", object, "received a value", v);
        }
    });
    return object;
}