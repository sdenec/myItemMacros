// this item
let itemName = item.data.name;

// controlled Token
let tokens = canvas.tokens.controlled;
let currentActor = tokens[0];

//define favorite enemies and damage
let favEnemies = ["undead", "beast"];
let favName = "unknown";
let favDmgBonus = 2;

// set condition name as defined in cub
// add marked dmg bonus
let featName = "Hunter's Mark";
let markDmgBonus = "1d6";

// get default damage formula and type
let defaultDmg = [item.data.data.damage.parts[0]];
let defaultDmgFormula = defaultDmg[0][0];
let defaultDmgType = defaultDmg[0][1];

// find selected target
let targets = Array.from(game.user.targets);

if(targets.length == 0 || targets.length > 1){
  ui.notifications.warn("Please select a single target to attack.");
} else {

  let target = targets[0].actor.data;
  let targetType = target.data.details.type;
  let isFav = false;
  let isMarked = false;

  let activeEffects = target.flags.dynamiceffects?.activeEffects;
  let huntersMark = activeEffects.filter(activeEffect => activeEffect._itemName == featName);

  // if favorite enemy apply bonus
  for (let i=0, max = favEnemies.length; i < max; i++){
    if(targetType.toLowerCase() == favEnemies[i]){
      isFav = true;
      favName = favEnemies[i];
      // stop execution
      break;
    }
  }

  if(huntersMark.length != 0){
    isMarked = true;
  }

  if(isFav && isMarked){

    // set new damage formula and type
    let newDmgFormula = `${defaultDmgFormula} + ${markDmgBonus} + ${favDmgBonus}`;
    let newDmg = [[newDmgFormula,defaultDmgType]];

    ChatMessage.create({
      speaker: {
        alias: currentActor.data.name
      },
      content: `
        <p><b>Attacking marked Favorite Enemy: <i>${favName}</i></b><br>
        Adding ${markDmgBonus}+${favDmgBonus} Damage Bonus on a hit!</>
      `
    });

    item.update({'data.damage.parts': newDmg});
    game.dnd5e.rollItemMacro(itemName);

    setTimeout(function(){ 
        item.update({'data.damage.parts': defaultDmg});
      }, 500);

  } else if (isFav){

    // set new damage formula and type
    let newDmgFormula = `${defaultDmgFormula} + ${favDmgBonus}`;
    let newDmg = [[newDmgFormula,defaultDmgType]];

    ChatMessage.create({
      speaker: {
        alias: currentActor.data.name
      },
      content: `
        <p><b>Attacking Favorite Enemy: <i>${favName}</i></b><br>
        Adding +${favDmgBonus} Damage Bonus on a hit!</>
      `
    });

    item.update({'data.damage.parts': newDmg});
    game.dnd5e.rollItemMacro(itemName);

    setTimeout(function(){ 
        item.update({'data.damage.parts': defaultDmg});
      }, 500);

  } else if (isMarked){

    // set new damage formula and type
    let newDmgFormula = `${defaultDmgFormula} + ${markDmgBonus}`;
    let newDmg = [[newDmgFormula,defaultDmgType]];

    ChatMessage.create({
      speaker: {
        alias: currentActor.data.name
      },
      content: `
        <p><b>Attacking marked Enemy</b><br>
        Adding ${markDmgBonus} Damage Bonus on a hit!</>
      `
    });

    item.update({'data.damage.parts': newDmg});
    game.dnd5e.rollItemMacro(itemName);

    setTimeout(function(){ 
        item.update({'data.damage.parts': defaultDmg});
      }, 500);

  } else {
    // roll regular
    game.dnd5e.rollItemMacro(itemName);
  }

}