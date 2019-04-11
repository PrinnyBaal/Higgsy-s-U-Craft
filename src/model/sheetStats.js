

// if (localStorage.getItem("savedChars") === null) {
//   localStorage.setItem('savedChars', JSON.stringify(savedChars));
// }
//
// if (localStorage.getItem("activeChar") === null) {
//   localStorage.setItem('activeChar', 0);
// }

let construct={
  Effect:function(){
    this.effectType="armor";
    this.bonus=0;
    this.bonusType="other";
    this.bonusSpell=0;
    this.addOn="no";
    this.useRestriction="noLimit";
    this.spellLevel=0;
    this.casterLevel=1;
    this.activationType="singleSpellCompletion";
    this.materialComponent=0;
    this.spellDuration="minutes";

    this.chargesPerDay=1;

    //////

  },

  Item:function(){

    this.aura="Strong Magic Vibes Probably";
    this.costAdjust=0;
    this.casterLevel=1;
    this.slot="head";
    this.price=0;
    this.weight=0;
    this.description="Shall I compare thee to a Holy Avenger?  Thou art more customized and less alignment-restrictive.  (NOTE: This text goes off the card!  Throw in some linebreaks, that is hit enter, to place the text on multiple lines)";
    this.itemName="The Sword of Lies";
    this.constructRequirements="Craft Wondrous Items, etc.";
    this.constructionCost=0;
    this.effects=[new construct.Effect()];
    this.activeEffect=0;

    this.shortName=null;
    this.nameX=null;
    this.nameY=null;
    this.nameFontNum=20;
    this.nameFontFam="Georgia";

    this.shortDescription=null;
    this.descriptionX=null;
    this.descriptionY=null;
    this.descriptionFontNum=20;
    this.descriptionFontFam="Georgia";

    this.shortTitle="Wondrous Item";
    this.titleX=null;
    this.titleY=null;
    this.titleFontNum=20;
    this.titleFontFam="Georgia";

    this.image="https://img.icons8.com/color/96/000000/sword.png";
    this.background="https://res.cloudinary.com/metaverse/image/upload/v1554830129/DnD_Card_template.png";


  }
}

if (localStorage.getItem("item") === null) {
  localStorage.setItem('item', JSON.stringify(new construct.Item()));
}


function resetStorage(){
  if (window.confirm("Do you really want to delete all your saved info?")) {
  localStorage.clear();
  location.reload();
}
}
