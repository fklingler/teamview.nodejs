
import {Component, OnInit} from "@angular/core";
import {PlayerService} from "../services/player.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {IPlayer} from "../../../shared/models/player";
import * as player_helpers from "../../../shared/models/player_helpers";
import _ from "lodash";

@Component({
    selector: 'teamview-playerviewer',
    templateUrl: './playerviewer-component.html',
    styleUrls: ['./playerviewer-component.scss']
})

export class PlayerViewerComponent implements OnInit {

    public player: IPlayer;

    constructor( private playerService: PlayerService, private route: ActivatedRoute  ) {

    }

    public async ngOnInit() {
        this.route.paramMap.switchMap((params: ParamMap) =>
            this.playerService.get( params.get( "id" )))
                .subscribe( ( player: IPlayer ) => {
                    this.player = _.cloneDeep( player );
                    player_helpers.initializeExtendedData( this.player, this.player.team.fixtures.length );
                });
    }
}
