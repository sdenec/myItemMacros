// this item
let itemName = item.data.name;

// controlled Token
let tokens = canvas.tokens.controlled;
let currentActor = tokens[0];

// set condition name ad defined in cub
let featName = "Hunter's Mark";

// define temp bonus
let dmgBonus = "1d6";

// get default damage formula and type
let defaultDmg = [item.data.data.damage.parts[0]];
let defaultDmgFormula = defaultDmg[0][0];
let defaultDmgType = defaultDmg[0][1];

// set new damage formula and type
let newDmgFormula = `${defaultDmgFormula} + ${dmgBonus}`;
let newDmg = [[newDmgFormula,defaultDmgType]];

// find selected target
let targets = Array.from(game.user.targets);

if(targets.length == 0 || targets.length > 1){
  ui.notifications.warn("Please select a single target to attack.");
} else {

  let target = targets[0].actor.data;
  let activeEffects = target.flags.dynamiceffects?.activeEffects;
  if(activeEffects){

  let huntersMark = activeEffects.filter(activeEffect => activeEffect._itemName == featName);
    if(huntersMark.length != 0){
      // print out chat message for favorite enemy attack
      ChatMessage.create({
        speaker: {
          alias: currentActor.data.name
        },
        content: `
          <p><b>Target is Marked!</b><br>
          Adding ${dmgBonus} Damage Bonus on a hit!</>
        `
      });

      item.update({'data.damage.parts': newDmg});
      game.dnd5e.rollItemMacro(itemName);

      // reset bonus after 500 ms
      setTimeout(function(){ 
          item.update({'data.damage.parts': defaultDmg});
        }, 500);

      // stop execution
      return;
    }
  }

  // if not marked do standard roll
  game.dnd5e.rollItemMacro(itemName);
}
