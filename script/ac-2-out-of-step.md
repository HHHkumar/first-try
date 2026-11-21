# Out of Step: Resistors, Coils and Capacitors on AC

Narration script, draft 1. English, about 11 minutes. Series 2 (Alternating Current), video 2 of 6.

Lines in plain text are spoken. Lines marked **On screen** describe the picture and are not spoken. **Hero scene** marks a showpiece shot. A timeline strip runs along the bottom of the frame, as in the earlier videos. The look is "Aurora", as in video 1: voltage waves in pink, current waves in cyan throughout.

---

## 1. Three components, one supply

**On screen:** One alternating supply, drawn as the turning loop, feeding three branches side by side: a resistor, a coil, a capacitor. Above each, two ribbons: the voltage in pink, the current in cyan. Over the resistor the two ribbons rise and fall together. Over the coil the cyan ribbon trails behind. Over the capacitor it runs ahead.

Take one alternating supply, and connect three things to it in turn. A resistor. A coil. A capacitor.

In all three, an alternating voltage produces an alternating current. Same frequency, same smooth shape. So far, nothing surprising.

But look at the timing. In the resistor, the current rises and falls exactly with the voltage. In the coil, the current runs late. In the capacitor, it runs early.

Last time, we called that gap in timing phase. In this video we find out where it comes from. The answer explains why a coil can limit a current without getting warm, why a capacitor passes a current although nothing crosses its gap, and why engineers talk about a second kind of opposition that is not resistance at all.

---

## 2. The resistor: in step

**On screen:** The resistor alone. The pink voltage ribbon and the cyan current ribbon, perfectly aligned, crest over crest. Inside the resistor, the electrons shuffle and the lattice glows, brighter at each crest, dark at each zero. Below, a third ribbon in gold: the power, always above the line, pulsing twice in every cycle. Its average is marked.

Start with the resistor, because it holds no surprises.

A resistor obeys Ohm's law at every instant. Whatever the voltage is at this moment, the current is that voltage divided by the resistance. When the voltage is at its peak, so is the current. When the voltage is zero, the current is zero. When the voltage reverses, the current reverses with it.

So the two waves are in phase. They keep perfect step.

Now look at the power. Power is voltage times current. When both are positive, the power is positive. When both are negative, a negative times a negative is positive again. So the power never goes below zero. A resistor takes energy on both halves of the cycle, and turns all of it into heat.

The power does pulse. It swells and fades twice in every cycle. But its average is simple: the RMS voltage times the RMS current. That, you will remember, is exactly what RMS was invented for.

---

## 3. The coil: the current runs late

**On screen:** The coil alone, with its field. **Hero scene:** the current ribbon in cyan, and on it a marker showing its slope, how fast it is changing. Where the current crosses zero, the slope is steepest, and the pink voltage ribbon is at its crest. Where the current is at its crest, the slope is flat, and the voltage is zero. The two ribbons settle a quarter of a cycle apart. Beside it, a heavy trolley on rails being pushed back and forth: the hand's push in pink, the trolley's speed in cyan, lagging.

Now the coil. Remember what a coil cares about. In the video on inductance, we saw that a coil does not oppose a current. It opposes a change in current. The voltage across it depends on how fast the current is changing.

So ask: when is an alternating current changing fastest?

Not at its crest. At the crest it has stopped rising and has not yet started to fall. For an instant it is not changing at all. So at that instant the voltage across the coil is zero.

The current changes fastest as it sweeps through zero, on its way from one direction to the other. So that is when the voltage is greatest.

Put the two side by side. The voltage peaks, and only a quarter of a cycle later does the current peak. In a coil, the current lags the voltage by ninety degrees.

You can feel why. Think of pushing a heavy trolley back and forth on rails. You push hardest at the very start, when it is standing still. It reaches its greatest speed later, just as your push dies away. The trolley's speed lags your push. Its mass does to motion what inductance does to current.

---

## 4. Reactance

**On screen:** Timeline: 1893. A coil on a supply whose frequency is slowly turned up: the current ribbon shrinks as the frequency rises. At zero frequency, steady current, the coil is just a wire and the current is large. A read-out in ohms climbs. *X_L = 2π f L*. A worked figure: 0.1 henry at 50 hertz, 31 ohms. The coil stays cool while a resistor of the same ohms beside it glows.

A coil on alternating current limits the current, just as a resistor would. But it does so in a completely different way, and we give it a different name: reactance.

How large is it? Think about the frequency. The faster the supply alternates, the faster the current has to change, and the harder the coil pushes back. Double the frequency, and the reactance doubles. And a larger inductance pushes back harder still.

So the reactance of a coil is two pi, times the frequency, times the inductance.

It is measured in ohms, because it is a voltage divided by a current. A coil of a tenth of a henry, at fifty hertz, has a reactance of about thirty-one ohms. At five thousand hertz, the same coil has three thousand ohms. And for a steady current, at zero frequency, it has none. That is why a coil passes direct current freely and holds back alternating current.

But these are not the ohms of a resistor. A resistor with thirty-one ohms gets hot. An ideal coil with thirty-one ohms does not. We will see why in a moment.

The word reactance was proposed in eighteen ninety-three, by a French engineer, Édouard Hospitalier, as alternating current was first being put to work.

---

## 5. The capacitor: the current runs early

**On screen:** The capacitor alone, its plates filling and emptying. The pink voltage ribbon, and on it a marker for its slope. Where the voltage crosses zero and is changing fastest, the cyan current ribbon is at its crest: charge is pouring on. Where the voltage is at its crest, the plates are full and the current is zero. The two ribbons a quarter of a cycle apart, the current ahead. Beside it, a tank being filled and emptied through a pipe: the flow is greatest when the tank is empty, zero when it is full.

Now the capacitor, and here everything is the other way round.

A capacitor's voltage depends on the charge on its plates. Current is charge arriving or leaving. So the current is large when the voltage is changing fast, and zero when the voltage is not changing.

Follow one cycle. Start with the capacitor empty and the supply voltage just beginning to rise. The voltage is climbing as steeply as it ever does, so charge pours onto the plates. The current is at its greatest.

As the voltage nears its crest, it levels off. The plates are nearly full, and the flow dwindles. At the crest itself, the voltage stops changing, and the current is zero.

Then the voltage starts to fall, and the charge flows back out. The current has already reversed, while the voltage is still positive.

So in a capacitor the current peaks first, and the voltage a quarter of a cycle later. The current leads the voltage by ninety degrees.

Think of filling a tank from the bottom. The water rushes in fastest when the tank is empty. As the level rises, the flow slows, and when the tank is full, it stops. The flow comes first. The level follows.

And notice: no charge ever crosses the gap between the plates. The current we measure is charge flowing onto one plate and off the other, back and forth. As far as the rest of the circuit can tell, a current is passing through.

---

## 6. Capacitive reactance

**On screen:** A capacitor on a supply whose frequency is slowly turned up: this time the current ribbon grows. At zero frequency the current is zero. A read-out in ohms falls. *X_C = 1 / (2π f C)*. A worked figure: 100 microfarads at 50 hertz, 32 ohms. Then the coil's line and the capacitor's curve on one graph of ohms against frequency, one rising and one falling, crossing at a point that is marked and left for later.

A capacitor has reactance too. But it behaves in the opposite way.

Raise the frequency, and the plates are charged and discharged more often every second. More charge moves each second, so the current is larger. A larger capacitor holds more charge for the same voltage, so again the current is larger.

So the reactance of a capacitor goes down as the frequency goes up. It is one, divided by two pi, times the frequency, times the capacitance.

A capacitor of a hundred microfarads, at fifty hertz, has a reactance of about thirty-two ohms. At five thousand hertz, a third of an ohm. And for a steady voltage, at zero frequency, its reactance is beyond measure: no current at all. A capacitor blocks direct current and passes alternating current.

Set the two side by side. As the frequency rises, the coil's reactance climbs and the capacitor's falls. At one particular frequency they are equal. Something remarkable happens there, and it has a video of its own.

---

## 7. Where the energy goes

**On screen:** **Hero scene:** the coil with its voltage and current ribbons a quarter cycle apart, and beneath them the power ribbon in gold. This time it swings above and below the line in equal measure. Each time it is above, the field around the coil swells; each time it is below, the field shrinks and the energy runs back down the wire to the supply. The same for the capacitor and the field between its plates. A meter for average power reads zero, while the current meter still reads amperes.

Now we can answer the puzzle. Why does a coil with thirty-one ohms of reactance stay cool?

Look at the power again: voltage times current. In the resistor, the two were in step, and their product was always positive.

In the coil, they are a quarter of a cycle apart. For a quarter of the cycle, both are positive, and the coil takes energy from the supply. That energy goes into building its magnetic field. For the next quarter, one is positive and the other negative. The power is negative. The field is collapsing, and the coil is handing the energy back.

Take, give back. Take, give back. Over a whole cycle, the average power is zero. Nothing is turned into heat.

A capacitor does the same, with its electric field. It borrows energy as it charges, and returns it as it discharges.

So reactance does not consume energy. It only borrows it. But notice what that means for the wires. A real current is flowing back and forth the whole time, carrying energy that nobody uses. The generator must supply that current, and the cables must carry it. This is what engineers call reactive power, and the cost of it will be the subject of a later video.

---

## 8. Putting them to work

**On screen:** A loudspeaker cabinet in section: a large cone and a small one. The signal arrives as a tangle of slow and fast waves. A coil in line with the large cone lets the slow waves through; a capacitor in line with the small cone lets the fast ones through. Then a memory card: the word CIVIL, with its letters lighting in groups. Then a fluorescent lamp with its choke.

Because coils and capacitors treat frequencies so differently, we can use them to sort one frequency from another.

Look inside a loudspeaker cabinet. There is a large cone for the low notes and a small one for the high notes. A coil is wired in line with the large cone. Low frequencies pass through it easily, and high ones are held back. A capacitor is wired in line with the small cone, and does the opposite. Between them, they send each note to the cone that can play it.

A coil is also the gentlest way to limit an alternating current. A resistor would do it by wasting energy as heat. A coil does it by reactance, and wastes almost nothing. That is the job of the choke in an old fluorescent lamp.

And here is a way to remember which way round the timing goes. Think of the word CIVIL. In a capacitor, C, the current, I, comes before the voltage, V. That is C, I, V. In an inductor, L, the voltage, V, comes before the current, I. Read from the middle: V, I, L. Capacitor, current leads. Inductor, current lags.

---

## 9. Recap

**On screen:** The timeline, complete. The three components side by side once more with their pairs of ribbons: in step, lagging, leading. Below each, its power ribbon. The two reactance formulas. End card: Like · Share · Subscribe, with the channel handle @electricalmcqs.

So let's put it together.

In a resistor, the current keeps step with the voltage, and all the energy becomes heat.

In a coil, the voltage depends on how fast the current is changing. So the current lags the voltage by a quarter of a cycle.

In a capacitor, the current depends on how fast the voltage is changing. So the current leads by a quarter of a cycle.

Both oppose alternating current with reactance, measured in ohms. A coil's reactance rises with frequency. A capacitor's falls.

And reactance consumes no energy. It borrows it, and gives it back.

But real circuits are never just one of these. They have resistance, inductance and capacitance all at once, and the current is neither in step nor a full quarter cycle out. To deal with that, an engineer in eighteen ninety-three found a way to replace every wave with a simple turning arrow. Next time: phasors, and impedance.

If this helped you see it, and not just calculate it, please like, share, and subscribe to this channel.
