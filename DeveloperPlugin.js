var plugin = {
	'name' 	      : 'Developer Plugin',
	'description' : 'Contains commands for developers.'
};

var coordsCommand = {
    execute : function(player, arguments) {
        player.getSession().sendNotification(NotifyType.STAFF_ALERT,
                    "X: " + player.getPosition().getX() + "\nY: " + player.getPosition().getY() + "\nALT: " + player.getPosition().getAltitude()  + "\nROT: " + player.getRotation())
        return true;
    }
};

var effectCommand = {
    execute: function(player, arguments) {
        player.applyEffect(arguments.readInteger());
        return true;
    }
};

var carryCommand = {
    execute: function(player, arguments) {
        player.handleVending(arguments.readInteger());
        return true;
    }
};

var saveitCommand = {
	execute: function(player, arguments) {
		var los = Bootloader.getGame().getFurnitureManager().getFurnitures().values().toArray();
		var writer = new java.io.PrintWriter("interactors.txt", "UTF-8");
		for (var i = 0; i < los.length; i++) {
			writer.println(los[i].getId() + "-" + los[i].getInteractor());
		}
		writer.close();
		return true;
	}
};

var chatCommand = {
    execute: function(player, arguments) {
        var players =  player.getRoom().getRoomPlayers().values().toArray();
        var targetName = arguments.readWord();
        if (targetName == null || targetName.isEmpty()) {
            player.getSession().sendNotification(NotifyType.STAFF_ALERT, "Du hast einen ungültigen Nutzernamen eingegeben. Wähle einen Habbo aus, der sich in deinem aktuellem Raum befindet.");
            return true;
        }
        if (targetName.equals(player.getPlayerInformation().getPlayerName())) {
            player.getSession().sendNotification(NotifyType.STAFF_ALERT, "Falls du mit deinem Benutzer schreiben möchtest, benötigst du keinen \":chat\"-Präfix.");
            return true;
        }
        var message = arguments.readMessage();
        if (message == null || message.isEmpty() || message.length > 100) {
            player.getSession().sendNotification(NotifyType.STAFF_ALERT, "Die zu versendene Nachricht darf nicht kürzer als eins oder länger als hundert Zeichen sein.");
            return true;
        }
        for (var i = 0; i < players.length; i++) {
            if (players[i].getSession() == null || !targetName.equals(players[i].getPlayerInformation().getPlayerName()))
                continue;
            player.getRoom().getRoomTask().offerChatMessageAdd(
                    new ChatMessage(players[i], arguments.readMessage(),
                            arguments.isShouted() ? ChatType.SHOUT : ChatType.SAY));
            return true;
        }
        player.getSession().sendNotification(NotifyType.STAFF_ALERT, "Der eingegebene Benutzername existiert in diesem Raum nicht, deshalb konnte die Nachricht nicht versandt werden.");
        return true;
    }
};

function initializePlugin() {
	IDK.addChatCommand('coords', 'command_coords', 'coordsCommand');
	IDK.addChatCommand('effect', 'command_effect', 'effectCommand');
	IDK.addChatCommand('chat',   'command_chat', 'chatCommand');
    IDK.addChatCommand('carry', 'command_carry', 'carryCommand');
	IDK.addChatCommand('saveit', 'command_carry', 'saveitCommand');
}