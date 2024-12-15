// Частина 1: Визначення типів та інтерфейсів
enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER"
}

enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED"
}

interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
}

type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
};

// Частина 2: Функції
let heroIdCounter = 1;

function createHero(name: string, type: HeroType): Hero {
    const baseStats: Record<HeroType, HeroStats> = {
        [HeroType.Warrior]: { health: 120, attack: 15, defense: 10, speed: 5 },
        [HeroType.Mage]: { health: 80, attack: 25, defense: 5, speed: 7 },
        [HeroType.Archer]: { health: 100, attack: 20, defense: 7, speed: 10 },
    };

    return {
        id: heroIdCounter++,
        name,
        type,
        attackType: type === HeroType.Warrior
            ? AttackType.Physical
            : type === HeroType.Mage
            ? AttackType.Magical
            : AttackType.Ranged,
        stats: baseStats[type],
        isAlive: true,
    };
}

function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const isCritical = Math.random() < 0.2;
    const attackPower = isCritical ? attacker.stats.attack * 2 : attacker.stats.attack;
    const damage = Math.max(0, attackPower - defender.stats.defense);
    const remainingHealth = Math.max(0, defender.stats.health - damage);

    return {
        damage,
        isCritical,
        remainingHealth,
    };
}

function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find(hero => hero[property] === value);
}

function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `${hero1.name} або ${hero2.name} вже не можуть брати участь у битві.`;
    }

    const attack1 = calculateDamage(hero1, hero2);
    hero2.stats.health = attack1.remainingHealth;
    hero2.isAlive = hero2.stats.health > 0;

    let result = `${hero1.name} атакує ${hero2.name}: Завдано ${attack1.damage} пошкоджень`;
    if (attack1.isCritical) result += " (Критичний удар!)";

    if (!hero2.isAlive) {
        result += `\n${hero2.name} переможений!`;
        return result;
    }

    const attack2 = calculateDamage(hero2, hero1);
    hero1.stats.health = attack2.remainingHealth;
    hero1.isAlive = hero1.stats.health > 0;

    result += `\n${hero2.name} атакує ${hero1.name}: Завдано ${attack2.damage} пошкоджень`;
    if (attack2.isCritical) result += " (Критичний удар!)";

    if (!hero1.isAlive) {
        result += `\n${hero1.name} переможений!`;
    }

    return result;
}

// Частина 3: Практичне застосування
const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леголас", HeroType.Archer),
];

// Демонстрація функцій
console.log("=== Герої ===");
console.log(heroes);

console.log("=== Пошук героя ===");
const foundHero = findHeroByProperty(heroes, "type", HeroType.Mage);
console.log(foundHero);

console.log("=== Битва ===");
const battleResult = battleRound(heroes[0], heroes[1]);
console.log(battleResult);
