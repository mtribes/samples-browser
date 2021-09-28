import { BrowserModule } from "@angular/platform-browser";
import {
	Component,
	OnInit,
	NgModule,
	enableProdMode,
	EventEmitter,
	Input,
	Output,
	ChangeDetectionStrategy,
} from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { client, session, collections, Experience } from "src/mtspace/sample";

const { header, body } = collections.homepage;

// enableProdMode();

// Enable live updates by disabling the session lock cache.
// NOTE: This should usually only be disabled in development
//       when you want to see published changes from mtribes instantly.
//       **Disabling in production can cause your UI to change
//       under a user during their session.**
client.sessionLock = false;

// fake known user we'll use when signed in
const FAKE_USER = {
	id: "2id2f459d2s5",
	name: "Olivia",
	subscription: "gold",
};

@Component({
	selector: "app-root",
	template: `
		<app-header
			[user]="user"
			(login)="onLogin($event)"
			(logout)="onLogout()"
		></app-header>
		<main>
			<app-body [user]="user"></app-body>
		</main>
	`,
	styles: [],
})
export class AppComponent implements OnInit {
	ready = session.ready;
	user = undefined;

	async ngOnInit() {
		// for demo purposes we'll always start logged out
		await this.onLogout();
	}

	async onLogin(user) {
		await session.start({
			userId: user.id,
			fields: {
				subscription: user.subscription,
			},
		});
		this.user = user;
	}

	async onLogout() {
		await session.start();
		this.user = undefined;
	}
}

// Header Component

@Component({
	selector: "app-header",
	template: `
		<header
			*ngIf="enabled"
			[style.background-color]="bgColor"
			[style.background]="bgGradient"
		>
			<div class="logo"></div>
			<h4 *ngIf="user" class="welcome">{{ user.name }}</h4>
			<button class="btn-auth" (click)="onAuthToggle()">
				{{ user ? "Sign-out" : "Sign-in" }}
			</button>
		</header>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [],
})
export class HeaderComponent implements OnInit {
	@Input() user;
	@Output() login = new EventEmitter();
	@Output() logout = new EventEmitter();

	enabled = header.enabled;
	btnLabel = "";
	bgColor = header.data.backgroundColor?.value;
	bgGrad = header.data.gradientColor?.value;
	bgGradient = "";

	ngOnInit() {
		this.updateBackground();
		header.changed.add(() => {
			this.updateBackground();
		});
	}

	onAuthToggle() {
		if (this.user) {
			this.logout.emit();
		} else {
			this.login.emit(FAKE_USER);
		}
	}

	private updateBackground() {
		this.bgGradient = `linear-gradient(91deg, ${this.bgColor}, ${this.bgGrad})`;
	}
}

// Body Component

@Component({
	selector: "app-body",
	template: `
		<div *ngFor="let exp of experiences" [ngSwitch]="exp.kind">
			<ng-template ngSwitchCase="HeroExperience">
				<img class="hero" src="{{ exp.data.source }}" />
			</ng-template>
			<ng-template ngSwitchCase="BannerExperience" [ngIf]="ready">
				<div class="banner">
					<button class="btn-secondary" (click)="onTrackClick(exp)">
						{{ exp.data.label || "..." }}
					</button>
				</div>
			</ng-template>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [],
})
export class BodyComponent implements OnInit {
	@Input() user;
	ready = session.ready;
	experiences = body.children;

	ngOnInit() {}

	onTrackClick(exp: Experience) {
		exp.track("item/clicked");
	}
}

@NgModule({
	declarations: [AppComponent, HeaderComponent, BodyComponent],
	imports: [BrowserModule],
	providers: [],
	bootstrap: [AppComponent],
})
class AppModule {}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => console.error(err));
