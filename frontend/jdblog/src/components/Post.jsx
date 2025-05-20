"use client";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import Highlight from "react-highlight";
import "../hljs.css";

const FlattenPre = ({ children }) => {
  const pretype = (<Highlight />).type;
  if (React.isValidElement(children) && children.type === pretype) {
    return <>{children}</>;
  }
  // Default fallback
  return <pre>{children}</pre>;
};

function Post() {

  const markdown = `

Quod creamur qua genitum iuvenemque germanam vagantem
=====================================================

Capitis pallorque et quas freta
-------------------------------

Lorem markdownum stabit qualem reliquit Stygiis utraque coeamus: erat. Cutis
vultus illis iras vix auctoremque cacumine.

> In premunt cornua huic caesis ut, hunc saepe auribus ipsumque in sit?
> Praeferre Dodonaeo, crescunt Maia quaterque atque ortus Circes, vestra canibus
> miseram vocamus, te vacent. Hac in dixi amor passa sincerae dextera dedit
> summa secum temptataque, enim dea utque? Leonibus corpus.

Vultus Dies Graias. Cunis te resolvit est altior est suae partimque
Pelethronium. Pedesque tergusque lavere inquiri, at mens, ut sumitur,
[aequora](http://www.nefas.io/sitis) numeri auro! Erat non de quod, uris oculos
hominum.

Me corpora longo senectus abductas latices iam
----------------------------------------------

Sicaniam in terrent Veneris favilla, quo ille: *maius* Pyramus lacrimis stabat
fertilis virginis. Contra postarum montesque **caeli quam pomoque** succincta
tenaci tamquam, et laesum de **arcus** placet: agna porrigis. Querenda in undis
cum cum insuper, est quam mutant perfudit dabat loca placere narrantia maxima
portat. (Hello)[http://hello.com]

> Donec fugit pereat et avia **corpore aequora verbis**! Laeva te mox, superos;
> distat motu mando crepitantia, annoso. Aper per vulgus, matre, per ne nos hac
> quae unum.

Pullosque nympha denique vultus? Unum lux se casses auras, squalidus; uteroque,
dumque nec tenetque fecit regum Lethaei fundamine procubuit in patriae. Amictae
simul, at in pia Parthenopen, habebant, quam dona mortales limina et mihi et
perbibit dissimilisque mente. Centum tergo ora [quondam
lumina](http://quae-qui.com/me)! Panaque spolium, vires: per umbram *adsiduo*
virgine, contendere tela: semper quaerentes pedibus aetas: **promisitque**
solus.

\`\`\`python
import hello
def foo(**kwargs): 
    return "hi"
hello.hi(foo(blue="bye"))
\`\`\`

Oris quam illic dei conspicuus quod orbe indignata vel collemque coryli ficta
obstantia corona, custodia elige contentus valet
[eiectat](http://bello.io/durastis.aspx). Malorum nos deum Stygias, tibi arma
erat: est, est! Signum profana ferarum arcana supervolat pavida.
`;

  return (
    <>
      <div className="prose prose-xs prose-slate dark:prose-invert prose-a:text-emerald-500 mx-auto">
        <Markdown
          components={{ code: Highlight, pre: FlattenPre }}
          remarkPlugins={[remarkGfm]}
        >
          {markdown}
        </Markdown>
      </div>
    </>
  );
}

export default Post;
