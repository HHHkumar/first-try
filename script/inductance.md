# The Current That Won't Stop: Inductance

Narration script, draft 1. English, about 9 minutes. Video 4 of the six-part series.

Lines in plain text are spoken. Lines marked **On screen** describe the picture and are not spoken. **Hero scene** marks a showpiece shot. A timeline strip runs along the bottom of the frame, as in the earlier videos.

---

## 1. The spark at the switch

**On screen:** Timeline: 1832. A bench in Albany, New York: a small battery, a switch, and a long wire wound into a coil. The switch closes quietly. It opens, and a bright spark leaps across the gap. Then the same battery with a short straight wire: the switch opens, and nothing happens.

In eighteen thirty-two, Joseph Henry, the man who built the great electromagnets, noticed something odd on his bench.

He had a small battery, far too weak to give a shock. When he connected it to a short wire and broke the circuit, nothing happened. But when the wire was long, and wound into a coil, breaking the circuit made a bright spark jump across the gap.

The battery had not changed. The spark was coming from the coil. Something in that coil was refusing to let the current stop.

That something is inductance. It is in every motor, every transformer, and every power line you will ever work on.

---

## 2. A field takes energy to build

**On screen:** The solenoid from the last video. The current begins, and the field grows outward from the coil, line by line, filling the space. A read-out for energy climbs with it. Then the current steady, the field steady, and the read-out still.

Last time, we saw that a current makes a magnetic field, and that a coil concentrates it.

Now look more closely at the moment the current starts. The field is not there, and then it is. It has to be built. And like the electric field between the plates of a capacitor, a magnetic field holds energy.

That energy has to come from somewhere. It comes from the circuit. So while the field is being built, the circuit has to do extra work, on top of whatever it does to push current through the wire.

Once the current is steady, the field is steady, and it costs nothing more to keep. The energy sits there, stored in the space in and around the coil.

---

## 3. The coil pushes back

**On screen:** Timeline: 1831, 1834. Faraday's notebook page, one line picked out: a changing magnetic field produces a voltage. The coil again, with the current rising: a voltage arrow appears across the coil, opposing the rise. The current falling: the arrow flips, and now pushes the current on. Lenz's name beside the arrow.

How does the circuit feel that extra work? Through a voltage.

In eighteen thirty-one, Michael Faraday found that a changing magnetic field produces a voltage in any wire it passes through. We will give that discovery a video of its own. Here we need only one consequence.

A coil sits in its own field. So when its current changes, its own field changes, and a voltage appears across the coil itself.

Which way does that voltage point? In eighteen thirty-four, the physicist Heinrich Lenz gave the rule. It always opposes the change that caused it.

Try to raise the current, and the coil pushes back against the rise. Try to reduce the current, and the coil pushes it forward, trying to keep it going. A coil does not resist current. It resists a change in current.

---

## 4. Inductance

**On screen:** Timeline: 1886, 1893. A heavy flywheel beside the coil: a hand tries to spin it up, and it is slow to start; the hand lets go and it keeps turning. *V = L × rate of change of current* assembles. Heaviside's name beside the word inductance; Henry's name on the unit. A ladder of sizes: henry, millihenry, microhenry, each with a real component beside it.

Think of a heavy flywheel. It is hard to get turning, and once it is turning, it is hard to stop. It does not object to spinning. It objects to changing its speed. A coil treats current the same way.

How strongly it objects is its inductance. The faster you try to change the current, the larger the voltage the coil produces. The ratio between the two is the inductance, written L.

The voltage across a coil equals its inductance, times the rate at which the current is changing.

The word itself was coined in eighteen eighty-six by Oliver Heaviside, a self-taught English engineer. The unit came seven years later. At the International Electrical Congress in Chicago, in eighteen ninety-three, it was named the henry, after the man who saw the spark.

One henry means this: if the current changes by one ampere each second, the coil produces one volt. It is a large unit. The inductors on a circuit board are measured in thousandths or millionths of a henry.

---

## 5. What sets it

**On screen:** A coil with its turns counted. The number of turns doubles and the read-out for inductance goes up four times. The coil grows fatter, then longer. An iron core slides in and the read-out leaps. *L = μ N² A / l* assembles. Then a single straight wire, with its own faint rings of field and a very small read-out.

What decides the inductance of a coil? Only its shape, and what it is wound on.

Start with the number of turns. Double the turns, and the same current makes twice the field. But that field now passes through twice as many turns, and each of them adds its own voltage. So the inductance does not double. It goes up four times. Inductance grows with the square of the number of turns.

A wider coil encloses more field, so inductance grows with the area. A longer coil, with the same turns spread out, has a weaker field, so inductance falls with the length.

And then there is the core. Put iron inside, and its domains multiply the field, hundreds or thousands of times. The inductance is multiplied with it.

Notice one more thing. Any wire carrying current has a field around it. So every wire has some inductance, even a straight one. Usually it is tiny. At high frequencies, or on a long power line, it matters a great deal.

---

## 6. Where the energy is

**On screen:** The field around the coil glowing brighter as the current rises. A graph of current against time, with the energy filling in beneath. *W = ½ L I²*, set beside the capacitor's *W = ½ C V²* from two videos ago. Then the switch opens: the field collapses inward onto the coil, and the energy pours out as the spark.

We said the field holds energy. How much?

The work is done against the coil's voltage while the current climbs from zero. Add it all up, and the energy stored is one half, times the inductance, times the current squared.

Set that beside the capacitor. There, the energy was one half C V squared, stored in an electric field. Here, it is one half L I squared, stored in a magnetic field. A capacitor stores energy in voltage. An inductor stores it in current.

And now Henry's spark makes sense. Open the switch, and the current must stop. The field collapses, and all its energy has to go somewhere, at once. The coil produces whatever voltage it takes to keep the current flowing, hundreds or thousands of volts, enough to drive it straight across the air in the open switch.

---

## 7. Inductors in circuits

**On screen:** An inductor and a resistor connected to a battery: the current starts at zero and climbs along a curve toward its final value, with the time constant marked at sixty-three percent. Then a steady current passing through the coil with no opposition, against an alternating current being held back, more and more as the frequency rises. A capacitor and an inductor side by side, as mirror images.

Connect a coil and a resistor to a battery. The current cannot jump to its final value, because the coil will not allow a sudden change. It climbs, quickly at first, then more slowly.

The pace is set by one number: the inductance divided by the resistance. This is the time constant. After one time constant the current has reached about two thirds of its final value. After five, it is there for every practical purpose.

Once the current is steady, the coil does nothing at all. It is just a piece of wire. But an alternating current is always changing, so the coil opposes it all the time, and the faster it alternates, the stronger the opposition.

So an inductor passes direct current and holds back alternating current. That is exactly the opposite of a capacitor. The two are mirror images, and much of electrical engineering is built on playing one against the other.

---

## 8. Everywhere

**On screen:** Timeline: 1851, 1899. **Hero scene:** Ruhmkorff's induction coil, a great bobbin of fine wire, throwing a long crackling spark between two brass points. Then, quickly: a spark plug firing inside an engine cylinder; a relay coil with a diode across it, the current looping harmlessly through the diode; a smoothing choke turning a rippling current into a level one; a long telephone line with small coils set along it; a transmission line marching across country with rings of field around its conductors.

Engineers soon learned to use the spark. In eighteen fifty-one, Heinrich Ruhmkorff in Paris built induction coils that turned a few volts from a battery into sparks many centimetres long. The same idea fires the spark plugs in a petrol engine.

They also learned to respect it. Switch off a relay or a motor carelessly, and the voltage from its coil can destroy the switch, or the transistor that drives it. That is why you will see a diode connected across almost every relay coil: it gives the current a safe path while the field dies away.

In a power supply, an inductor called a choke smooths the current, just as a capacitor smooths the voltage. In eighteen ninety-nine, Michael Pupin added coils at intervals along telephone lines, and made long-distance calls possible.

And on the grid, the inductance of the lines and windings themselves decides how power flows, how far the voltage drops, and how large a fault current can become.

---

## 9. Recap

**On screen:** The timeline, complete. Each idea returns as one image: the spark at the switch, the field building, the opposing voltage, the flywheel, the coil with its core, the collapsing field, the rising curve. The final frame holds *V = L × rate of change of current* and *W = ½ L I²* over the coil. End card: Like · Share · Subscribe, with the channel handle @electricalmcqs.

So let's put it together.

A magnetic field takes energy to build, and gives it back when it collapses.

So a coil opposes any change in its own current. That property is inductance, measured in henries.

It grows with the square of the turns and the area of the coil, and it is multiplied by an iron core.

The energy is stored in the field, and it equals one half L I squared.

An inductor takes time to carry a current, passes a steady one, and holds back a changing one.

Twice now we have leaned on one fact: a changing magnetic field makes a voltage. Next time, we look at how the electric field and the magnetic field are tied together.

If this helped you see it, and not just calculate it, please like, share, and subscribe to this channel.
