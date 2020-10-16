var a = <a/>;
var b = <n:a n:v />;
var c = <a n:foo="bar"> {value} <b><c /></b></a>;
var d = <a b={" "} c=" " d="&amp;" e="&ampr;" />;
var e = <a\n/>;
var f = <日本語></日本語>;
var g = <AbC-def\n  test="&#x0026;&#38;">\nbar\nbaz\n</AbC-def>;
var h = <a b={x ? <c /> : <d />} />;
var i = <a>{}</a>;
var j = <a>{/* this is a comment */}</a>;
var k = <div>@test content</div>;
var l = <div><br />7x invalid-js-identifier</div>;
var m = <LeftRight left=<a /> right=<b>monkeys /> gorillas</b> />;
var n = <a.b></a.b>;
var o = <a.b.c></a.b.c>;
var p = (<div />) < x;;
var q = <div {...props} />;
var r = <div {...props} post="attribute" />;
var s = <div pre="leading" pre2="attribute" {...props}></div>;
var t = <A aa={aa.bb.cc} bb={bb.cc.dd}><div>{aa.b}</div></A>;
var u = <p>foo <a href="test"> bar</a> baz</p> ;;
var v = <div>{<div {...test} />}</div>;
var x = <div>{ {a} }</div>;
var w = <div>/text</div>;
var y = <div>{a}{b}</div>;
var z = <div pre="leading" {...props} />;
var ç = <path d="M230 80\n\t\tA 45 45, 0, 1, 0, 275 125 \r\n    L 275 80 Z"/>;

var arr = [1, 2, 3].map(function(n) {
  return <a>{n}</a>;
});

var f = function() {
  return <a></a>;
};