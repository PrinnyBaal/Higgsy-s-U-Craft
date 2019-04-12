
sheetProj.view.sheetLogic = {
  setupUserInterface: function () {
    console.log(JSON.parse(localStorage.getItem("item")));
    workshop.setWorkshopValues();
    workshop.updateWorkshop();
    data.getFontList();



    }
};

let workshop={
  updateWorkshop:function(){
    //called upon creation of a new effect and on first load/effect swap if effect type is null
    let effect=data.getEffect();
    $(".workshopHidable").addClass("hidden");
    if (effect.effectType){
      //set specific and effect questions
      $("#effectSpecificQuestions").removeClass("hidden");
      $("#generalEffectQuestions").removeClass("hidden");
      ///

      if (["armor", "weapon", "abilityScore", "natArmor", "skills"].includes(effect.effectType)){
        $("#bonusSize").removeClass("hidden");
      }
      if (["spellSlot"].includes(effect.effectType)){
        $("#bonusSpell").removeClass("hidden");
      }
      if (["spellResist"].includes(effect.effectType)){
        $("#spellResist").removeClass("hidden");
      }
      if (["spellEffect"].includes(effect.effectType)){
        $("#spellEffect").removeClass("hidden");

        if(["commandWord", "continuous", "useActivated"].includes(effect.activationType)){
          if (["continuous", "useActivated"].includes(effect.activationType)){
            $("#spellDuration").removeClass("hidden");
          }
          if (["continuous", "commandWord"].includes(effect.activationType)){
            $("#itemCharges").removeClass("hidden");
          }
          if(["charges"].includes(effect.useRestriction)){
            $("#chargesPerDay").removeClass("hidden");
          }
        }

      }
      if (["AC", "saves"].includes(effect.effectType)){
        $("#bonusSize").removeClass("hidden");
        $("#bonusType").removeClass("hidden");
      }

    }
    workshop.displayEffectTabs();
  },

  displayEffectTabs:function(){
     let item=data.getItem();
     let effectLength=item.effects.length;
     let effectTabs=``;

     for (let i=0; i<effectLength; i++){
       let active="";
       if (i==item.activeEffect) active=" activeRibbon";
       effectTabs+=`<div class="ribbonWrapper ml-1"><div class="effectRibbon ${active}" onclick="workshop.setActiveEffect(${i})" >${i+1}</div></div>`;
     }

     effectTabs+=`<div class="ribbonWrapper ml-1"><div class="masterRibbon" onclick="workshop.addEffect()" >+</div></div>`;




     $("#effectListing").html(effectTabs);
  },

  setActiveEffect:function(effectNum){
    let item=data.getItem();
    item.activeEffect=parseInt(effectNum);
    data.saveItem(item);
    workshop.updateWorkshop();
    workshop.setWorkshopValues();
  },

  setWorkshopValues:function(){
    let item=data.getItem();
    let effect=data.getEffect();



    if (effect.effectType!==null) $("#effectTypeInput")[0].value=`${effect.effectType}`;
    if (effect.bonus!==null) $("#bonusSizeInput")[0].value=`${effect.bonus}`;
    if (effect.bonusType!==null)  $(`input[name=bonusType][value=${effect.bonusType}]`).prop("checked",true);
    if (effect.addOn!==null) $(`input[name=itemAddOn][value=${effect.addOn}]`).prop("checked",true);
    if (effect.useRestriction!==null) $(`input[name=itemCharges][value=${effect.useRestriction}]`).prop("checked",true);
    if (effect.bonusSpell!==null) $("#bonusSpell")[0].value=`${effect.bonusSpell}`;

    if (effect.spellLevel!==null) $("#spellLevelInput")[0].value=`${effect.spellLevel}`;
    if (effect.casterLevel!==null) $("#casterLevelInput")[0].value=`${effect.casterLevel}`;
    if (effect.materialComponent!==null) $("#materialComponentInput")[0].value=`${effect.materialComponent}`;
    if (effect.activationType!==null) $(`input[name=activationMethod][value=${effect.activationType}]`).prop("checked",true);
    if (effect.spellDuration!==null) $(`input[name=spellDuration][value=${effect.spellDuration}]`).prop("checked",true);


    if (item.aura!==null) $("#auraInput")[0].value=`${item.aura}`;
    if (item.casterLevel!==null) $("#itemLevelInput")[0].value=`${item.casterLevel}`;
    if (item.slot!==null) $(`input[name=itemSlot][value=${item.slot}]`).prop("checked",true);
    if (item.costAdjust!==null) $("#costAdjustInput")[0].value=`${item.costAdjust}`;
    if (item.weight!==null) $("#weightInput")[0].value=`${item.weight}`;
    if (item.description!==null) $("#itemDescriptionInput").html(item.description);
    if (item.constructRequirements!==null) $("#requirementInput")[0].value=`${item.constructRequirements}`;
    if (item.aura!==null) $("#auraInput")[0].value=`${item.aura}`;

    //itemCost
  },

  addEffect:function(){
    let item=data.getItem();

    item.effects.push(new construct.Effect());

    data.saveItem(item);
    workshop.updateWorkshop();
  },
  deleteEffect:function(){
    let item=data.getItem();

    if (item.effects.length>1){
      item.effects.splice(item.activeEffect, 1);
      if (item.activeEffect>=item.effects.length){
        item.activeEffect=item.effects.length-1;
      }
    }
    else{
      alert("Sorry, but you can't delete an effect if it's the only one on your item!");
    }
    data.saveItem(item);
    workshop.updateWorkshop();

  },
  craftItem:function(){
    let item=data.getItem();
    let price=magicMath.getItemCost(item);
    let craftedItem=``;


    $("#completedItems").removeClass("hidden");
    console.log(price);

    craftedItem+=`
    <div class="row">
      <p class="col-4"><b>${item.itemName}</b></p>
      <hr>
    </div>
    <div class="row">
      <p class="col-8"><b>Aura:</b>${item.aura}</p>
      <p class="col"><b>CL:</b>${item.casterLevel}</p>
    </div>
    <div class="row">
      <p class="col-4"><b>Slot:</b> ${item.slot};</p>
      <p class="col"><b>Price:</b> ${price} gp;</p>
      <p class="col"><b>Wgt:</b> ${item.weight} lbs</p>
    </div>
    <hr>
    <div class="row">
      <div class="col"><b>Description</b><hr>
       ${item.description}:</div>
    </div>
    <div class="row">

      <div class="col"><hr><b>Construction Requirements:</b><hr>${item.constructRequirements}; &nbsp;&nbsp;<b>Raw Material Cost:</b>${price/2} <br></div>
    </div>`;


    $("#finalItem").html(craftedItem);
    cardMaker.setItemCardForm();
    cardMaker.createCard();
  },



  effectStatChange:function(statName, newValue){

    console.log(statName);
    console.log(newValue);
    let effect=data.getEffect();

    effect[statName]=newValue;

    data.saveEffect(effect);
    workshop.updateWorkshop();

  },

  itemStatChange:function(statName, newValue){
    console.log(statName);
    console.log(newValue);
    let item=data.getItem();

    item[statName]=newValue;

    data.saveItem(item);

  }

}

let cardMaker={
  displayItemCard:function(){
  let canvas = $("#itemCardCanvas")[0];
  let ctx = canvas.getContext('2d');
  // canvas.width = $('img').width();
  canvas.crossOrigin = "Anonymous";
  // canvas.height = $('img').height();

  //load images THEN draw images

  ctx.drawImage($('img').get(0), 0, 0);
  ctx.font = "36pt Verdana";

  //redraw image
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage($('img').get(0), 0, 0);
  //refill text
  ctx.fillStyle = "red";
  ctx.fillText($(this).val(),40,80);


},
setItemCardForm:function(){
  let item=data.getItem();

  if (!item.shortName){
    item.shortName=item.itemName;
  }
  if (!item.shortDescription){
    item.shortDescription=item.description;
  }

  if (item.shortName) $("#shortNameInput")[0].value=`${item.shortName}`;
  if (item.shortTitle) $("#shortTitleInput")[0].value=`${item.shortTitle}`;
  if (item.shortDescription) $("#shortDescriptionInput").html(item.shortDescription);
  if (item.image) $("#imageInput")[0].value=`${item.image}`;

  if (item.nameX) $("#nameXInput")[0].value=`${item.nameX}`;
  if (item.nameY) $("#nameYInput")[0].value=`${item.nameY}`;
  if (item.nameFontNum) $("#nameFontNumInput")[0].value=`${item.nameFontNum}`;
  if (item.nameFontFam) $("#nameFontFamInput")[0].value=`${item.nameFontFam}`;

  if (item.descriptionX) $("#descriptionXInput")[0].value=`${item.descriptionX}`;
  if (item.descriptionY) $("#descriptionYInput")[0].value=`${item.descriptionY}`;
  if (item.descriptionFontNum) $("#descriptionFontNumInput")[0].value=`${item.descriptionFontNum}`;
  if (item.descriptionFontFam) $("#descriptionFontFamInput")[0].value=`${item.descriptionFontFam}`;

  if (item.titleX) $("#titleXInput")[0].value=`${item.titleX}`;
  if (item.titleY) $("#titleYInput")[0].value=`${item.titleY}`;
  if (item.titleFontNum) $("#titleFontNumInput")[0].value=`${item.titleFontNum}`;
  if (item.titleFontFam) $("#titleFontFamInput")[0].value=`${item.titleFontFam}`;

  data.saveItem(item);
},
createCard:function(){
// let promisedBackground= new Promise
// Promise.all([promisedBackground, promisedImage]).then(function(images){
//
// });
  let item=data.getItem();
  let promisedBackground= new Promise(function (resolve, reject){
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject('error');

    img.src = item.background;
  });
  let promisedItem= new Promise(function (resolve, reject){
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject('error');

    img.src = item.image;
  });



  // const checkImage = path =>
  //     new Promise(resolve, reject) => {
  //         const img = new Image();
  //         img.onload = () => resolve({path, status: 'ok'});
  //         img.onerror = () => reject({path, status: 'error'});
  //
  //         img.src = path;
  //     });
  Promise.all([promisedBackground,promisedItem]).then(
    function(img){
      let canvas = $("#itemCardCanvas")[0];
      let ctx = canvas.getContext('2d');

      if (!item.nameX)  item.nameX=canvas.width/2;
      if (!item.nameY)  item.nameY=canvas.height/12.5;

      if (!item.titleX)  item.titleX=canvas.width/2;
      if (!item.titleY)  item.titleY=canvas.height/1.3;

      if (!item.descriptionX)  item.descriptionX=canvas.width/5;
      if (!item.descriptionY)  item.descriptionY=canvas.height/1.25;

      data.saveItem(item);

      canvas.crossOrigin = "Anonymous";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      //load images THEN draw images
      ctx.drawImage(img[0], 0, 0, img[0].width,    img[0].height,
                    0, 0, canvas.width, canvas.height);

      ctx.drawImage(img[1], 0, 0, img[1].width,    img[1].height,
                    canvas.width/4, canvas.height/4.5, canvas.width/2, canvas.height/2.5);

      //write name

      ctx.font = `${item.nameFontNum}px ${item.nameFontFam}`;
      ctx.fillText(item.shortName, item.nameX, item.nameY);
      //write Title
      ctx.font = `${item.titleFontNum}px ${item.titleFontFam}`;
      ctx.fillText(item.shortTitle, item.titleX, item.titleY);
      //write description
      ctx.textAlign = "left";
      ctx.font = `${item.descriptionFontNum}px ${item.descriptionFontFam}`;
      let lineHeight=ctx.measureText("M").width;
      let lines = item.shortDescription.split('\n');
      for (let i=0; i<lines.length; i++){
        ctx.fillText(lines[i], item.descriptionX, item.descriptionY+(i*lineHeight));
      }

      console.log(item.shortDescription);

      console.log(lines);


  });
},

setFontOptions:function(){

    let fonts=data.getFonts();

    let fontSelect=``;

    // <option value="armor">Armor Bonus (enhancement)</option>
    // <option value="weapon">Weapon Bonus (enhancement)</option>
    // <option value="spellSlot">Bonus Spell</option>
    // <option value="spellResist">Spell Resistance</option>
    // <option value="spellEffect">Spell Effect</option>
    //
    // <option value="abilityScore">Ability Bonus (enhancement)</option>
    // <option value="AC">AC Bonus (deflection/other)</option>
    // <option value="natArmor">Natural Armor Bonus (Enhancement)</option>
    // <option value="saves">Save Bonuses (Resistance/Other)</option>
    // <option value="skills">Skill Bonuses (Competence)</option>

    //Create for loop to create options for each font.  Could we set the font for each to be their own individual fonts?  That SEEMS totally doable...
    fonts.forEach(function(font){
      fontSelect+=`<option style="font-family:'${font}'"value="'${font}'">${font}</option>`;
    });
    $(".fontSelector").html(fontSelect);

}


}

let magicMath={
  getEffectCost:function(effect){
    effect=magicMath.prepareEffectNumbers(effect);
    let price=0;
    let spellLevel;
    if (effect.spellLevel<1){
      spellLevel=.5;
    }
    else{
      spellLevel=effect.spellLevel;
    }

    switch(effect.effectType){
      case "armor":
        price+=(Math.pow(effect.bonus,2)*1000);
        break;
      case "weapon":
        price+=(Math.pow(effect.bonus,2)*2000);
        break;
      case "spellSlot":
        price+=(Math.pow(effect.bonusSpell,2)*1000);
        break;
      case "spellResist":
        if (effect.bonus>12){
          price+=((effect.bonus-12)*10000);
        }
        break;
      case "spellEffect":
        switch(effect.activationType){
          case "singleSpellCompletion":
            price+=(spellLevel*effect.casterLevel*25);
            price+=effect.materialComponent;
            break;
          case "singleUseActivated":
            price+=(spellLevel*effect.casterLevel*50);
            price+=effect.materialComponent;
            break;
          case "spellTrigger":
            price+=(spellLevel*effect.casterLevel*750);
            price+=effect.materialComponent*50;
            break;
          case "commandWord":
            price+=(spellLevel*effect.casterLevel*1800);
            if (effect.useRestriction=="charged"){
              price*=.5;
              price+=effect.materialComponent*50;
            }
            else if (effect.useRestriction=="charges"){
              price=price/(5/effect.chargesPerDay);
              price+=effect.materialComponent*50;
            }
            else{
              price+=effect.materialComponent*100;
            }
            break;
          case "useActivated":
            price+=(spellLevel*effect.casterLevel*2000);
            if (effect.useRestriction=="charged"){
              price*=.5;
              price+=effect.materialComponent*50;
            }
            else if (effect.useRestriction=="charges"){
              price=price/(5/effect.chargesPerDay);
              price+=effect.materialComponent*50;
            }
            else{
              price+=effect.materialComponent*100;
            }
            break;
          case "continuous":
            price+=(spellLevel*effect.casterLevel*2000);
            switch(effect.spellDuration){
              case "rounds":
                price*=4;
                break;
              case "minutes":
                price*=2;
                break;
              case "tenMinutes":
                price*=1.5;
                break;
              case "days":
                price*=.5;
                break;
              default:
                console.log("spellDuration not listed...");
                break;
            }
            if (effect.useRestriction=="charged"){
              price*=.5;
              price+=effect.materialComponent*50;
            }
            else if (effect.useRestriction=="charges"){
              price=price/(5/effect.chargesPerDay);
              price+=effect.materialComponent*50;
            }
            else{
              price+=effect.materialComponent*100;
            }
            break;
          default:
            console.log(`no activation type match listed...`);
            break;
          }

          case "abilityScore":
            price+=(Math.pow(effect.bonus,2)*1000);
            break;
          case "natArmor":
            price+=(Math.pow(effect.bonus,2)*2000);
            break;
          case "AC":
            if (effect.bonusType=="deflection"){
              price+=(Math.pow(effect.bonus,2)*2000);
            }
            else{
              price+=(Math.pow(effect.bonus,2)*2500);
            }
            break;
          case "saves":
            if (effect.bonusType=="resistance"){
              price+=(Math.pow(effect.bonus,2)*1000);
            }
            else{
              price+=(Math.pow(effect.bonus,2)*2000);
            }
            break;
          case "skills":
            price+=(Math.pow(effect.bonus,2)*100);
            break;
          default:
            console.log(`${effect.effectType} is not a known effect type`);
            break;
        }







    if (effect.addOn=="yes"){
      price*=1.5;
    }
    return price;
  },
  getItemCost:function(item){
    //searches every saved effect and updates both cost and construction cost of this object
    let totalPrice=0;
    //should throw a fit if an effect doesn't have all needed information
    item.effects.forEach(function(effect){totalPrice+=Number(magicMath.getEffectCost(effect))});
    if (item.slot=="slotless"){
      totalPrice*=2;
    }
    Number(totalPrice)+=Number(item.costAdjust);
    return totalPrice;
  },
  prepareEffectNumbers:function(effect){
    effect.bonus=Number(effect.bonus);
    effect.bonusSpell=Number(effect.bonusSpell);
    effect.bonusLevel=Number(effect.bonusLevel);
    effect.casterLevel=Number(effect.casterLevel);
    effect.materialComponent=Number(effect.materialComponent);
    effect.chargesPerDay=Number(effect.chargesPerDay);
    return effect;
  }

}

let data={
  getItem:function(){
    return JSON.parse(localStorage.getItem("item"));
  },
  getEffect:function(){
    let item=data.getItem();
    return item.effects[item.activeEffect];
  },
  saveItem:function(newItem){
      localStorage.setItem("item", JSON.stringify(newItem));
  },
  saveEffect:function(newEffect){
    let item=data.getItem();
    item.effects.splice(item.activeEffect, 1, newEffect);
    data.saveItem(item);
  },
  getFonts:function(){
    return JSON.parse(localStorage.getItem("fonts"));
  },
  getFontList:function(){
    let detective = new data.fontDetector();
    if (localStorage.getItem("fonts")){
      cardMaker.setFontOptions();
      return;
    }


    let untestedFonts=["Abadi MT Condensed Light", "Albertus Extra Bold", 'Zurich Ex BT','Zurich BlkEx BT',"Albertus Medium","Antique Olive ","Arial","Arial Black","Arial MT","Arial Narrow","Bazooka","Book Antiqua","Bookman Old Style ","Boulder","Calisto MT","Calligrapher","Century Gothic","Century Schoolbook","Cezanne","CG Omega","CG Times","Charlesworth","Chaucer","Clarendon Condensed","Comic Sans MS","Copperplate Gothic Bold","Copperplate Gothic Light","Cornerstone","Coronet","Courier","Courier New","Cuckoo","Dauphin","Denmark","Fransiscan","Garamond","Geneva","Haettenschweiler","Heather","Helvetica","Herald","Impact","Jester","Letter Gothic","Lithograph","Lithograph Light","Long Island","Lucida Console","Lucida Handwriting","Lucida Sans","Lucida Sans Unicode","Marigold","Market","Matisse ITC","MS LineDraw","News GothicMT","OCR A Extended","Old Century","Pegasus","Pickwick","Poster","Pythagoras","Sceptre","Sherwood","Signboard","Socket","Steamer","Storybook","Subway","Tahoma ","Technical",'Teletype','Tempus Sans ITC','Times','Times New Roman','Times New Roman PS','Trebuchet MS','Tristan','Tubular','Unicorn','Univers','Univers Condensed','Vagabond','Verdana','Westminster','Allegro','Amazone BT','AmerType Md BT','Arrus BT','Aurora Cn BT','AvantGarde Bk BT','AvantGarde Md BT','BankGothic Md BT','Benguiat Bk BT','BernhardFashion BT','BernhardMod BT','BinnerD','Bremen Bd BT','CaslonOpnface BT','Charter Bd BT','Charter BT','ChelthmITC Bk BT','CloisterBlack BT','CopperplGoth Bd BT','English 111 Vivace BT','EngraversGothic BT','Exotc350 Bd BT','Freefrm721 Blk BT','FrnkGothITC Bk BT','Futura Bk BT','Futura Lt BT','Futura Md BT','Futura ZBlk BT','FuturaBlack BT','Galliard BT','Geometr231 BT','Geometr231 Hv BT','Geometr231 Lt BT','GeoSlab 703 Lt BT','GeoSlab 703 XBd BT','GoudyHandtooled BT','GoudyOLSt BT','Humanst521 BT','Humanst 521 Cn BT','Humanst521 Lt BT ','Incised901 Bd BT ','Incised901 BT ','Incised901 Lt BT ','Informal011 BT ','Kabel Bk BT ','Kabel Ult BT ','Kaufmann Bd BT ','Kaufmann BT ','Korinna BT ','Lydian BT ','Monotype Corsiva','NewsGoth BT ','Onyx BT ','OzHandicraft BT','PosterBodoni BT','PTBarnum BT','Ribbon131 Bd BT','Serifa BT','Serifa Th BT','ShelleyVolante BT','Souvenir Lt BT','Swis721 BlkEx BT','Swiss911 XCm BT ','TypoUpright BT','ZapfEllipt BT','ZapfHumnst BT','ZapfHumnst Dm BT'];
    let fonts=untestedFonts.filter(font => detective.detect(font));
    localStorage.setItem("fonts",JSON.stringify(fonts));
    cardMaker.setFontOptions();
  },
  fontDetector:function(){
    /**
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and CSS.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-css-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didnt fallback
 *          to parent element if the font is missing.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          "monospace", "sans-serif" and "sans". If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 */

/**
 * Usage: d = new Detector();
 *        d.detect("font name");
 */
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ["monospace", "sans-serif", "serif"];

    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = "72px";

    var h = document.getElementsByTagName("body")[0];

    // create a SPAN in the document to get the width of the text we use to test
    var s = document.createElement("span");
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index in baseFonts) {
        //get the default width for the three base fonts
        s.style.fontFamily = baseFonts[index];
        h.appendChild(s);
        defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
        defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
        h.removeChild(s);
    }

    function detect(font) {
        var detected = false;
        for (var index in baseFonts) {
            s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
            h.appendChild(s);
            var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    }

    this.detect = detect;
  },


}

let shopHints={
  showHint:function(hint){

    if (shopHints.hintList[hint]){
      $("#hintContent").html(shopHints.hintList[hint]);
      $("#hintBox").removeClass("hidden");
    }
    else{
      console.log(`${hint} is not one of our saved hints...`);
    }
  },
  hideHint:function(){
    $("#hintBox").addClass("hidden");
  },
  hintList:{
    "bonusSize":`<span id="hintTitle">Bonus Size</span>
      <hr>
      Many item effects simply increase some statistic and their price is largely dertemined by the size of this bonus.  However, the ratio between point of increase and final GP cost varies between effects.  Examples below.<br><br>
      Note that 'Armor' bonuses refer to enhancements to a physical piece of armor as opposed to AC bonuses which offer enhancements to a character's AC directly.  Also, price estimates for some types of bonuses are not officially listed.<br><br>
      <hr>
      <b>Ability/Armor Bonus/ Saves (Resistance):</b> Bonus squared x 1,000 gp;<br>
      <hr>
      <b>Weapon /AC Bonus (Deflection)/ Natural Armor / Saves (Other):</b>Bonus squared x 2,000 gp;<br>
      <hr>
      <b>AC Bonus (Not Deflection):</b>Bonus squared x 2,500 gp;<br>
      <hr>
      <b>Skill Bonus:</b>Bonus squared x 100 gp;<br>
      <hr>
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "bonusSpell":`<span id="hintTitle">Bonus Spells</span>
      <hr>
      Bonus Spells refer to items that allow casters to cast their own spells an additional time per day and their cost is estimated mostly by the level of spell slot they allow the caster to use.  This does NOT refer to allowing the user to use an item to mimic the casting of a spell.  See the 'Spell Effect' category for that.
      <hr>
      <b>Bonus Spell:</b> Spell level squared x 1,000 gp;
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "spellResist":`<span id="hintTitle">Bonus Spells</span>
      <hr>
      Spell resistance is an odd duck in that according to the estimate rules it requires a *minimum* of 13 Spell Resistance to be granted and the estimated cost is priced accordingly.  Likely this is due to the Spell Resistance spell granting a minimum of 13 SR, assuming the caster doesn't somehow have 0 caster level.
      <hr>
      <b>Spell Resist:</b> 10,000 gp per point over SR 12;
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a><br>
      <a href="https://www.d20pfsrd.com/magic/all-spells/s/spell-resistance/">Spell Resistance (Spell)</a>`,
    "generalSpell":`<span id="hintTitle">Spell Effect</span>
      <hr>
      A common use of magic items is to mimic the effect of spells, either allowing the user to cast that spell (or a variation thereof) or constantly applying the effect of the Spell.  Note that of all effects, spell effects are the prime offenders when it comes to bending and breaking the estimated cost rules into something overpowered for its cost.<br><br>
      The cost formula for spells is in the Spells Activation [?] box.
      <hr>
      <b>Spell Level:</b>This is the level of the spell and has a multiplicative effect on the price of the effect.
      <hr>
      <b>Caster Level:</b> This is NOT the caster level of the overall item, but rather the caster level of the spell effect.  The Caster level of the item must be at least as high as any spell effects within the item however.  Additionally the caster level of the spell effect is the minimum level at which the spell could be cast normally. Has a multiplicative effect on the price of the effect.;
      <hr>
      <b>Material Cost:</b>Some spells have an expensive material component associated with them, if that is the case than the cost is simply added directly to cost of the final item for every time the spell can be used.  If the item can be used indefinitely multiply the material cost by 100 instead.  If the spell effect can be used X times per day multiple the material cost by 50 instead.  <br><br>
      The cost of expensive focuses (which are like material components but simply aren't consumed) isn't listed in the table but as they must still be provided this author assumes that simply adding the cost of the Focus a single time to the final cost is reasonable enough.
      <hr>
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a><br>`,
    "spellActivation":`


    <span id="hintTitle">Spell activation</span>
      <hr>
      A spell effect in a magical item can be activated by the user in different ways depending on the design of the item.  The method of activation changes the formula of how the price of the effect is calculated.
      <hr>
      <b>Single use, spell completion:</b>Spell level x caster level x 25 gp; (Consumable)<hr>
      <b>Single use, use-activated:</b>Spell level x caster level x 50 gp; (Consumable)<hr>
      <b>50 charges, spell trigger:</b>Spell level x caster level x 750 gp; (Consumable)<hr>
      <b>Command word:</b>Spell level x caster level x 1800 gp; (Non-consumable)<hr>
      <b>Use-activated or continuous:</b>Spell level x caster level x 2000 gp; (Non-consumable)<hr>
      <hr>
      Continuous Effects are given an additional multiplier based on the usual duration of the original spell.
      Based on a spell with a duration measured in rounds, multiply the cost by 4. If the duration of the spell is 1 minute/level, multiply the cost by 2, and if the duration is 10 minutes/level, multiply the cost by 1.5. If the spell has a 24-hour duration or greater, divide the cost in half.
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a><br>
    `,
    "bonusType":`<span id="hintTitle">Bonus Types</span>
      <hr>
      Static buffs to certain attributes can come in many different flavors, that is to say bonus types, in Pathfinder that represent the source of that bonus. Generally bonuses of the same type do not stack on the same attribute.  The important thing for our purposes is that the cost for some effects varies based on the bonus type with rarer bonus types costing a premium.  In addition some attributes don't HAVE an estimated cost provided by Paizo for anything other than a single effect type. (For example ability bonuses only have an enhancement bonus listed).  However items, and presumably a reverse-engineerable formula, do exist for many combinations of statistics and bonus types not available here.
      <hr>

      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "useRestriction":`<span id="hintTitle">Use Restriction</span>
      <hr>
      Command Word or Use Activated items that are not single-use might, nonetheless, have another limit on how frequently they can be used and their effect cost varies accordingly.
      <hr>
      <b>Charges Per Day:</b>Effect Price divided by (5 divided by charges per day);
      <hr>
      <b>Charged (50 charges):</b>Unlimited Use Effect Price divided by 2.  Do note that this option is for when a spell trigger (wand-like) activation is not necessary.;
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "addOn":`<span id="hintTitle">Add-On</span>
      <hr>
      Items can have multiple different effects.  When this is the case every effect (other than the most expensive one) is multiplied by 1.5<br>
      Note that this could simply be calculated behind the scenes but as a nod towards certain house-rules where 'common' effects like a deflection bonus to AC are not appleid the add-on multiplier it is instead left as a manual toggle.
      <hr>
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "itemSlot":`<span id="hintTitle">Item Slot</span>
      <hr>
      For the most part the slot an item is on doesn't effect the final price, but if an item is slotless this lack of oppurtunity cost instead doubles the value of the item as a whole.  Scrolls/wands/potions are exceptions as despite technically being slotless they do not incur this multiplier though in exchange they don't tend to have any additional effects.<br><br>
      On the other hand, if you're crafting armor, a shield or a weapon the cost of a masterwork version of that piece of equipment is added to the final price of the item.
      <hr>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "itemCasterLevel":`<span id="hintTitle">Item Caster Level</span>
      <hr>
      The overall caster level of an item.  Its minimum is the caster level of any spell effects contained within it however it can be higher.  Items with higher caster levels have certain in-game benefits such as being harder to dispell and effect how hard the item would be to craft but this statistic does not affect cost.
      <hr>
      <br><br>
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`,
    "costAdjust":`<span id="hintTitle">Cost adjustment</span>
      <hr>
      Estimations are just that, estimations.  This field allows you to apply any final changes to the cost of an item such as applying a discount in exchange for giving it some sort of drawback.
      <hr>
  `,
    "itemAura":`<span id="hintTitle">Item Aura</span>
      <hr>
      Most magical items give off an aura of some sort when observed through magical means such as detect magic.  This aura is generally the most powerful school of magic used in the crafting of the item or some combination of schools.  Auras such as 'Evil' are also possible but regardless this does not generally affect cost.
      <a href="https://www.d20pfsrd.com/magic-items/magic-item-creation/">PFSRD Citation</a>`

  },
}





function setClicks(){
  $("#resetButton").click(resetStorage);

  $("#charPortrait").click({element:'#charOverlay'},toggleDisplay);
  $("#exitPageButton").click({element:'#charOverlay'},toggleDisplay);
  $("#skillsPageButton").click({page:'#skillSheet'},turnPage);
  $("#statsPageButton").click({page:'#statSheet'},turnPage);

  $(".tabHead").click(collapseTabBody);
}
