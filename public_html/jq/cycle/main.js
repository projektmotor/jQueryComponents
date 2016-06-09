io.include("cycle.js");

blueprint.registerTestCase("appendChild(node)", new Packages.api.Function({
    run: function () {
        tests.assertEquals(Packages.jodd.lagarto.dom.DOMElement.ELEMENT_CLOSE, node.nextSiblingNode.type);
    }
}));

cs.extend.addAutocompletion({
    name: 'jQuery Cycle',
    scope: 'text/html',
    onSelect: function (completionObject) {
    },
    onBlur: function () {
    },
    onSubmit: function () {
        cycle.build();
        return "";//cycle object did all the necessary insertions already
    }
});
