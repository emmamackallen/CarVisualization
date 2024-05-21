class Control {
    #viewA;
    #viewB;

    constructor(data) {
        // Add new div to body
        const root = d3.select('body').append('div')
            .style('position', 'fixed')
            .style('top', '0')
            .style('left', '0')
            .style('width', '100%')
            .style('height', '100%');

        this.#viewA = new ViewA(this, root, data);
        this.#viewB = new ViewB(this, root, data);
    }

    //Let other views know that a view has been clicked
    Message(str) {
        this.#viewA.Hear(str);
        this.#viewB.Hear(str);
    }

    bToA(str) {
        this.#viewA.Filter(str);
    }
}